import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';


console.log("starting up Judges");
export const Judges = new Mongo.Collection('judges');


if (Meteor.isServer) {
  Meteor.publish('judges', function judgesPublication() {
    return Judges.find();
  });

  Meteor.publish('judge', function judgePublication(id) {
    return Judges.find({_id:id});
  });

  Meteor.publish('showJudges', function showJudgesPublication(ids) {
    return Judges.find({_id:{$in:ids}});
  });
}

Meteor.methods({
  'judge.insert'(object) {
    const id = Judges.insert(object);
    return id;
  },
  'judge.remove'(taskId) {
    check(taskId, String);
    Judges.remove(taskId);
  },
});
