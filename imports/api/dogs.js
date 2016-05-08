import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { FS } from 'meteor/cfs:base-package';
import { S3 } from 'meteor/cfs:s3';
import { resizeImageStream } from 'meteor/numtel:cfs-image-resize';
import Keys from '../credentials/keys.js';

console.log("starting up dogs");
export const Dogs = new Mongo.Collection('dogs');
export const MedicalRecords = new Mongo.Collection('medicalRecord');

let fileStore = new FS.Store.S3("dogImages",{
  accessKeyId: Keys.aws.key,
  secretAccessKey: Keys.aws.secret,
  bucket: "dichotic",
  folder: "Dogs"
});
let thumbStore = new FS.Store.S3("thumbs", {
  accessKeyId: Keys.aws.key,
  secretAccessKey: Keys.aws.secret,
  bucket: "dichotic",
  folder: "Dogs/thumbs",
  beforeWrite: function(fileObj) {
    // We return an object, which will change the
    // filename extension and type for this store only.
    return {
      extension: 'jpeg',
      type: 'image/jpeg'
    };
  },
  transformWrite: resizeImageStream({
    width: 250,
    height: 250,
    format: 'image/jpeg',
    quality: 50
  })
});
export const DogImages = new FS.Collection("DogImages", {
    stores: [fileStore, thumbStore],
    filter: {
        allow: {
            contentTypes: ['image/*']
        }
    }
});

let medicalStore = new FS.Store.S3("medicalDocuments",{
  accessKeyId: Keys.aws.key,
  secretAccessKey: Keys.aws.secret,
  bucket: "dichotic",
  folder: "MedicalDocuments",
});
export const MedicalDocuments = new FS.Collection("MedicalDocuments", {
    stores: [medicalStore]
});


if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('dogsImages', function dogsImagesPublications() {
    return DogImages.find();
  });

  Meteor.publish('dogImages', function dogImagesPublications(id) {
    return DogImages.find({_id:id});
  });

  Meteor.publish('dogs', function dogPublication() {
    return Dogs.find();
  });

  Meteor.publish('dog', function aDogPublication(id) {
    return Dogs.find({_id:id});
  });

  Meteor.publish('kenelDogs', function kenelDogs() {
    return Dogs.find();
  });

  Meteor.publish('dogMedicalDocuments', function dogMedicalDocumentPub(id) {
    return MedicalRecords.find({dog:id});
  });

  Meteor.publish('allMedicalDocuments', function allMedicalPub() {

    return MedicalRecords.find();
  });

  Meteor.publish('medicalPaperwork', function medicalPaperworkPub(ids){

    return MedicalDocuments.find({_id:{$in:ids}});
  });

  DogImages.allow({
    insert:function(userId,project){
      return true;
    },
    update:function(userId,project,fields,modifier){
     return true;
    },
    remove:function(userId,project){
      return true;
    },
    download:function(){
      return true;
    }
  });

  MedicalDocuments.allow({
    insert:function(userId,project){
      return true;
    },
    update:function(userId,project,fields,modifier){
     return true;
    },
    remove:function(userId,project){
      return true;
    },
    download:function(){
      return true;
    }
  });
}

Meteor.methods({
  'dog.insert'(object) {
    // check(text, String);

    // // Make sure the user is logged in before inserting a task
    // if (! Meteor.userId()) {
    //   throw new Meteor.Error('not-authorized');
    // }
    console.log(object);
    const id = Dogs.insert(object);
    return id;
  },
  'dog.medical'(object) {
    const id = MedicalRecords.insert(object);
    Dogs.update(
      {_id: object.dog},
      {$addToSet:
        {medical:id}
      }
    );

    console.log(object);
    console.log(id);
    return id;
  },
  'dog.cancelPedigree'(id){
    Dogs.update(
      {_id:id},
      {$set:
        {pedigree: false}
      }
    );
  },
  'dog.startPedigree'(id){
    Dogs.update(
      {_id:id},
      {$set:
        {
          pedigree: null,
          parentage:[],
          dateOfBirth: '',
          pedigreeDocument:'',
          points: '',
          title: '',
        }
      }
    );
  },
  'dog.setDateOfBirth'(id, birthday){
    Dogs.update(
      {_id:id},
      {
        $set:{dateOfBirth: new Date(birthday)}
      }
    )
  },
  'dog.setParentage'(id, sire, dam){
    const parentage = {};
    if(sire !== null){
      parentage['sire'] = sire;
    } else {
      parentage['sire'] = '';
    }

    if(dam !== null){
      parentage['dam'] = dam;
    } else {
      parentage['dam'] = '';
    }

    Dogs.update(
      {_id:id},
      {
        $set:{parentage: parentage}
      }
    )
  },
  'dog.setPedigreeDocument'(id,docId){
    Dogs.update(
      {_id:id},
      {
        $set:{pedigreeDocument: docId}
      }
    )
  },
  'dog.finishPedigree'(id){
    Dogs.update(
      {_id:id},
      {
        $set:{pedigree: true}
      }
    )
  },
  'dog.remove'(taskId) {
    check(taskId, String);

    Tasks.remove(taskId);
  },
});
