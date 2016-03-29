import { Mongo } from 'meteor/mongo';
console.log("starting up dogs");
export const Dogs = new Mongo.Collection('dogs');
