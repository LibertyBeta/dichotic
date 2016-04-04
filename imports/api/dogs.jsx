import { Mongo } from 'meteor/mongo';
import { FS } from 'meteor/cfs:base-package';
import { resizeImageStream } from 'meteor/numtel:cfs-image-resize';

console.log("starting up dogs");
export const Dogs = new Mongo.Collection('dogs');

let fileStore = new FS.Store.FileSystem("dogImages");
let thumbStore = new FS.Store.FileSystem("thumbs", {
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

// export const DogImages = new FS.Collection("DogImages", {
//   stores: [new FS.Store.FileSystem("DogImages", {path: "~/uploads"})]
// });
