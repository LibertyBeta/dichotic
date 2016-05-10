import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';
import { Meteor } from 'meteor/meteor';

import { Dogs, MedicalDocuments } from "../../api/dogs.js"

// Task component - represents a single todo item
export default class Pedigree extends Component{

  constructor(props) {
    super(props);
  }

  cancelPedigree(){
    Meteor.call("dog.cancelPedigree", this.props.dog._id);
  }

  initPedigree(){
    Meteor.call("dog.startPedigree", this.props.dog._id);
  }

  setDateOfBirth(){
    Meteor.call("dog.setDateOfBirth", this.props.dog._id, this.refs.dateOfBirth.value);
  }

  setParentage(){
    Meteor.call('dog.setParentage', this.props.dog._id, this.refs.sire.value, this.refs.dam.value);
  }

  setPedigreeDocument(){
    let instance = this;
    const file = MedicalDocuments.insert(this.refs.pedigree.files[0], function(error, result){
      if(error){

      } else {
        Meteor.call("dog.setPedigreeDocument", instance.props.dog._id, result._id);
        Meteor.call("dog.finishPedigree", instance.props.dog._id);
      }
    });

  }

  renderFirstStep(){
    if(this.props.dog.pedigree !== false && this.props.dog.pedigree !== null){
      return (
        <section>
          {this.props.dog.name} doesn't have a pedigree, do you want to add it?
          <div className="button-group left">
            <button onClick={()=>this.initPedigree()}>Yes</button>
            <button onClick={()=>this.cancelPedigree()}>No</button>
          </div>

        </section>

      )
    }
  }

  renderAddPedigree(){
    console.log(this.props.dog);
    if(this.props.dog.pedigree === null){
      if(!(this.props.dog.dateOfBirth instanceof Date)){
        return (
          <seciton>
            When was this dog born?
            <input type="date" name="dateOfBirth" ref="dateOfBirth"></input>
            <div className="button-group left">
              <button onClick={()=>this.setDateOfBirth()}>Next</button>
            </div>
          </seciton>
        )
      } else if(this.props.dog.parentage.length === 0) {
        console.log(this.props.maleDogs);
        return (
          <section>
            Are this dog's parents in DICHOTIC?
            <div className="input-group">
              Sire: <select ref="sire" name="sire">
                      <option value='null'>Sire Not in Dichotic</option>
                      {this.props.maleDogs.map((male)=>{
                        if(male._id !== this.props.dog._id){
                          return (
                            <option key={male._id} value={male._id}>{male.name}</option>
                          )
                        }

                      })}
                    </select>
            </div>
            <div className="input-group">
              Dam: <select ref="dam" name="dam">
                    <option value='null'>Dam Not in Dichotic</option>
                    {this.props.femaleDogs.map((female)=>{
                      if(female._id !== this.props.dog._id){
                        return (
                          <option key={female._id} value={female._id}>{female.name}</option>
                        )
                      }
                    })}
                  </select>
            </div>
            <div className="button-group left">
              <button onClick={()=>this.setParentage()}>Next</button>
            </div>

          </section>
        )
      } else if(this.props.dog.pedigreeDocument === ''){
        return (
          <section>
            Upload a Pedigree Document:
            <input type="file" name="pedigree" ref="pedigree"></input>
            <div className="button-group left">
              <button onClick={()=>this.setPedigreeDocument()}>Finish</button>
            </div>
          </section>
        )
      } else {
        return "CAKE PANTS";
      }
    }
  }


  render() {
    return (
      <section>
        {this.renderFirstStep()}
        {this.renderAddPedigree()}
      </section>

    )
  }
};


Pedigree.defaultProps = {
  dog: {},
  maleDogs : [],
  femaleDogs :[]
}

Pedigree.propTypes = {
  dog: React.PropTypes.object,
}

export default createContainer(({params}) => {
  Meteor.subscribe("dogs");
  const dog = Dogs.findOne({_id:params.id});
  console.log(dog);
  let dobCutoff = new Date();

  if(dog instanceof Object && dog.dateOfBirth instanceof Date){
    console.log("FOUND BIRHTDAY");
    dobCutoff = dog.dateOfBirth;
  }
  console.log(dobCutoff);
  const maleDogs = Dogs.find({
    $and:[
      {gender:'Male'},
      {dateOfBirth:{$lt: dobCutoff}}
    ]
    }).fetch();

  const femaleDogs = Dogs.find({
    $and:[
      {gender:'Female'},
      {dateOfBirth:{$lt: dobCutoff}}
    ]
    }).fetch();
  return {
    maleDogs,
    femaleDogs
  }
}, Pedigree)
