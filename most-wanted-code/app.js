"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      // TODO: search by traits
      searchResults = searchByTwoOrMore(people);
      break;
      default:
    app(people); // restart app
      break;
  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(person.length === 0){
    alert("Could not find that individual.");
    return app(people); // restart
  }
  //Running Test Commit
  if(person.length > 1){
    alert("Multiple matches found.");
    displayPeople(person);
    app(people);// restart
  }else{
    let displayOption = prompt("Found " + person[0].firstName + " " + person[0].lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");
  }

  switch(displayOption){
    case "info":
      displayPerson(person[0]);
    break;
    case "family":
    // TODO: get person's family
    let personfamily = findFamily(person[0], people);
    displayFamily(personfamily);
    break;
    case "descendants":
    // TODO: get person's descendants
    let descendants = findDescendents(person[0],people);
    displayPeople(descendants); 
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

function searchByName(people){
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  let foundPerson = people.filter(function(person){
    if(person.firstName === firstName && person.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person using the name they entered
  return foundPerson;
}
//Search by trait function
function searchByTrait(people){
  let foundPeople = "";
  
  let traitType = promptFor("Choose trait: Occupation, Height, Weight, Gender, Eye Color", chars);
  traitType = traitType.toLowerCase();
  switch (traitType){
    case "occupation":
      let chosenOccupation = promptFor("Choose occupation type", chars);
      foundPeople = people.filter(function(person){
        if(person.occupation === chosenOccupation){
          return true;
        } 
        else {
          return false;
        }
      })
      break;
    
    case "height":
      let chosenHeight = promptFor("Choose height", ints);
      foundPeople = people.filter(function(person){
        if(person.height === parseInt(chosenHeight)){
          return true;
        } 
        else {
          return false;
        }
      })
      break;

    case "weight":
      let chosenWeight = promptFor("Choose weight", ints);
      foundPeople = people.filter(function(person){
        if(person.weight === parseInt(chosenWeight)){
          return true;
        } 
        else {
          return false;
        }
      })
      break;

    case "gender":
      let chosenGender = promptFor("Choose gender", chars);
      foundPeople = people.filter(function(person){
        if(person.gender === chosenGender){
          return true;
        } 
        else {
          return false;
        }
      })
      break;

    case "eye color":
      let chosenEyeColor= promptFor("Choose eye color", chars);
      foundPeople = people.filter(function(person){
        if(person.eyeColor === chosenEyeColor){
          return true;
        } 
        else {
          return false;
        }
      })
      break;

     
  }
  return foundPeople;
}

function searchByTwoOrMore(people){
  let foundPeople = people;
  let numOfTraits = promptFor("How many Critereon would you like to choose from?", ints);
  
  for(let i = 0; i < numOfTraits; i++){
    foundPeople = searchByTrait(foundPeople)
  }
  return foundPeople;

  }

/*
Search by descendents
A - person
Search list
3 people with A as parents
search list
4 people with A's kids as parents
1
0

A
Person: BBB
Kids: CCCC
D
_

*/

function findDescendents(person, people, descendants = []){
  
  let kids = people.filter(function(searchperson){
    if(searchperson.parents[0] === person.id || searchperson.parents[1] === person.id){
      return true;
    }else{
      return false;
    }
  });
    kids.forEach(kid => {
      descendants.push(kid);
      findDescendents(kid,people,descendants);
    });
  
  return descendants;

}


function findFamily(person, people){
let family = [];
let parents = people.filter(function(searchPerson){
  if(searchPerson.id === person.parents[0] || searchPerson.id === person.parents[1]){
    return true;
  }else{
    return false;
  }
});
family.push(parents);
let siblings = people.filter(function(searchPerson){
  if((searchPerson.parents[0] === parents[0].id || searchPerson.parents[1] === parents[1].id || searchPerson.parents[0] === parents[1].id || searchPerson.parents[1] === parents[0].id) && searchPerson.id !== person.id){
    return true;
  }
  else{
    return false;
  }
});
family.push(siblings);
let spouse = people.filter(function(searchPerson){
  if((searchPerson.id === person.currentSpouse)){
    return true;
  }
  else{
      return false;
  }
});
family.push(spouse);
return family;
}


function displayFamily(family){
  let familyString = "Family members found";
  let parentString = "Parents: ";
  let siblingsString = "Siblings: ";
  let spouseString = "Spouse: ";
  parentString += family[0].map(function(person){
    return " " + person.firstName + " " + person.lastName;
  }
  );
  siblingsString += family[1].map(function(person){
    return " " + person.firstName + " " + person.lastName;
  });
  spouseString += family[2].map(function(person){
    return " " + person.firstName + " " + person.lastName;
  });
  alert(familyString + "\n" + parentString+ "\n" + siblingsString+ "\n" + spouseString);  
}

// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += "Gender: " + person.gender + "\n";
  personInfo += "DOB: " + person.dob + "\n";
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "Eye Color: " + person.eyeColor + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";

  // TODO: finish getting the rest of the information to display
  alert(personInfo);
}

// function that prompts and validates user input
function promptFor(question, valid){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input){
  for(let i = 0; i<input.length; i++){
    if(isNaN(parseInt(input[i]))){
      continue;
    }else{
      return false;
    }
  }
  return true; // default validation only
}

function ints(input){
  for(let i = 0; i<input.length; i++){
    if(!isNaN(parseInt(input[i]))){
      let x = parseInt(input[i]);
      console.log(x);
      continue;
    }else{
      return false;
    }
  }
  return true; // default validation only
}