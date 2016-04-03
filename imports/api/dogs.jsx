import { Mongo } from 'meteor/mongo';
import { FS } from 'meteor/cfs:base-package';

console.log("starting up dogs");
export const Dogs = new Mongo.Collection('dogs');

let fileStore = new FS.Store.FileSystem("dogImages");
export const DogImages = new FS.Collection("DogImages", {
    stores: [fileStore],
    filter: {
        allow: {
            contentTypes: ['image/*']
        }
    }
});

// export const DogImages = new FS.Collection("DogImages", {
//   stores: [new FS.Store.FileSystem("DogImages", {path: "~/uploads"})]
// });
