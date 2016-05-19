import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';
import { Meteor } from 'meteor/meteor';

import { Dogs, MedicalDocuments } from "../../api/dogs.js"

// Task component - represents a single todo item
export default class Genealogy extends Component{

  constructor(props) {
    super(props);

  }

  drawChart(context, x, y, generation, dog){
    
    context.textAlign = "center";
    context.fillStyle = "#000";
    context.font = "20px Verdana";

    context.fillText(dog.name, x, y);
    generation++;
    const xOffset = this.props.xOffset / generation;

    if(dog.pedigree === true && dog.parentage instanceof Object){
      context.beginPath();
      context.lineTo( x,  y);
      context.lineTo( x,  y +this.props.yOffset);
      context.stroke();
      if(dog.parentage.sire){
        context.beginPath();
        context.lineTo( x,  y +this.props.yOffset);
        context.lineTo( x+xOffset,  y +this.props.yOffset);
        context.stroke();
        this.drawChart(context, x+xOffset, y+this.props.yOffset, generation, this.props.family[dog.parentage.sire]);
      }

      if(dog.parentage.dam){
        context.beginPath();
        context.lineTo( x-xOffset,  y +this.props.yOffset);
        context.lineTo( x,  y +this.props.yOffset);
        context.stroke();
        this.drawChart(context, x-xOffset, y+this.props.yOffset, generation, this.props.family[dog.parentage.dam]);
      }
    }


  }

  componentDidUpdate(prevProps, prevState){
    
    

    const canvas = document.getElementById('genealogy-chart');
    const ratio = window.devicePixelRatio;
    canvas.width = this.props.canvasDefault * ratio;
    canvas.height = this.props.canvasDefault * ratio;
    canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    {/* canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0); */}
    if(this.props.family !== prevProps.family){
      if (canvas.getContext) {
        
		    const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = "bold 8pt Arial";

        let middle = (canvas.width / 2) / ratio;
        let vMiddle = canvas.height /2;
        
		    // context.fillText(this.props.family[this.props.params.id].name, middle, 20);
        this.drawChart(context, middle, 30, 0, this.props.family[this.props.params.id]);
      }
      
    }


  }

  render() {
    return (
      <section>
        <canvas id="genealogy-chart"></canvas>
      </section>

    )
  }
};


Genealogy.defaultProps = {
  dog: {},
  family: {},
  yOffset: 100,
  xOffset: 200,
  canvasDefault: 1000
}

Genealogy.propTypes = {
  dog: React.PropTypes.object,
}

export default createContainer(({params}) => {
  Meteor.subscribe("dogs");
  //So, lets do a little magic. Lets build a node map.
  let rootNode = Dogs.findOne({_id:params.id});
  let nodeMaker = function(id, depth, maxDepth){
    let nodeMap = {};
    
    let dog = Dogs.findOne({_id:id});

    if(dog){
      nodeMap[dog._id] = dog;
      if(depth >= maxDepth){
        return nodeMap;
      } else {
        if(dog.pedigree === true && dog.parentage instanceof Object){
          if(dog.parentage.sire){
            nodeMap = Object.assign(nodeMap, nodeMaker(dog.parentage.sire, depth+1, maxDepth));
          }
          if(dog.parentage.dam){
            nodeMap = Object.assign(nodeMap, nodeMaker(dog.parentage.dam, depth+1, maxDepth));
          }
        }

        return nodeMap;
      }
    }

  }
  let family = {};
  if(rootNode instanceof Object){
    family = nodeMaker(rootNode._id, 0, 5);
  }


  return {
    family
  }
}, Genealogy)
