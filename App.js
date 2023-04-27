import { useEffect, useState } from 'react';
import * as tf from "@tensorflow/tfjs";
import './App.css';

export default function Form() {
  //Set all the state variables and their modification functions
  const [model, setModel] = useState("");
  const [inputs, setInputs] = useState("{income:0,houseage:0,numroom:0,numbedroom:0,areapopulation:0}");
  const [output, setOutput] = useState("");

  async function loadmodel() {
    //We load the model and store it in model variable, which is a state variable
    try {
      const mod = await tf.loadGraphModel('/model.json')
      setModel(mod);
      console.log("Model loaded Successfully")
    }
    catch (err) {
      console.log("Error occured")
      console.log(err)
    }
  }
  //We have to wait to load the model so we use the useEffect hook to wait and load the model
  useEffect(() => {
    tf.ready().then(() => {
      loadmodel()
    });
  }, [])
  //Prediction Function, the first parameter is always the event argument "event"
  function Predict(event) {
    //Prevent the page from refreshing when you click submit
    event.preventDefault();
    //Pass a tensor to the model with all the input parameters, reshape them to -1,5, make them an array
    //It is a promise so we use the "then" keyword to create a function that takes the predicted value stored at 0th index
    //set the value to the output value using setOutput function
    model.predict(tf.tensor([parseFloat(inputs["income"]), parseFloat(inputs["houseage"]), parseFloat(inputs["numroom"]),
    parseFloat(inputs["numbedroom"]), parseFloat(inputs["areapopulation"])]).reshape([-1,5])).array().then(
      function (score) {score = score[0];
      setOutput(score)}
    )
    
  }
  //As we input data into the input field we want to see the data so here we keep updating the inputs
  //Inputs is an array created using useState
  const handlechange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  }
  //Reset function to clear all data
  function reset()
  {
    setInputs("{ income: 0, houseage: 0, numroom: 0, numbedroom: 0, areapopulation: 0 }")
    setOutput("")
  }

  return (
    <>
    <div className='elements'>
      <form onSubmit={Predict}>
        <label>Enter your Average Area Income: <input type='number' name="income" value={inputs.income || ""} onChange={handlechange} /></label>
        <br></br><br></br><br></br>
        <label>Enter your Average House Age: <input type='number' name="houseage" value={inputs.houseage || ""} onChange={handlechange} /></label>
        <br></br><br></br><br></br>
        <label>Enter your Average Number of Rooms: <input type='number' name="numroom" value={inputs.numroom || ""} onChange={handlechange} /></label>
        <br></br><br></br><br></br>
        <label>Enter your Average Number of Bed Rooms: <input type='number' name="numbedroom" value={inputs.numbedroom || ""} onChange={handlechange} /></label>
        <br></br><br></br><br></br>
        <label>Enter your Area Population: <input type='number' name="areapopulation" value={inputs.areapopulation || ""} onChange={handlechange} /></label>
        <br></br>
        <input class='butt' type='submit'/>
        <input class='butt' type="reset" onClick={reset}/>
      </form>
      </div>
      <p>The output is {output || ""}</p>
    </>
  )
}
