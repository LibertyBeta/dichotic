import { FS } from 'meteor/cfs:base-package';

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
