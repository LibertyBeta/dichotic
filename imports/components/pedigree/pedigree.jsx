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
          <button onClick={()=>this.initPedigree()}>Yes</button>
          <button onClick={()=>this.cancelPedigree()}>No</button>
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
            <button onClick={()=>this.setDateOfBirth()}>Next</button>
          </seciton>
        )
      } else if(this.props.dog.parentage.length === 0) {
        console.log(this.props.maleDogs);
        return (
          <section>
            Are this dog's parents in DICHOTIC?
            Sire: <select ref="sire" name="sire">
                    <option value='null'>Sire Not in Dichotic</option>
                    {this.props.maleDogs.map((male)=>{
                      return (
                        <option key={male._id} value={male._id}>{male.name}</option>
                      )
                    })}
                  </select>
            Dam: <select ref="dam" name="dam">
                  <option value='null'>Dam Not in Dichotic</option>
                  {this.props.femaleDogs.map((female)=>{
                    return (
                      <option key={female._id} value={female._id}>{female.name}</option>
                    )
                  })}
                </select>
            <button onClick={()=>this.setParentage()}>Next</button>
          </section>
        )
      } else if(this.props.dog.pedigreeDocument === ''){
        return (
          <section>
            Upload a Pedigree Document:
            <input type="file" name="pedigree" ref="pedigree"></input>
            <button onClick={()=>this.setPedigreeDocument()}>Finish</button>
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
  const maleDogs = Dogs.find({gender:'Male'}).fetch();
  const femaleDogs = Dogs.find({gender:'Female'}).fetch();
  return {
    maleDogs,
    femaleDogs
  }
}, Pedigree)
