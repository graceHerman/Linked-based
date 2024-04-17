/* [Location-specific interactive mechanism] There must be at least one location in the world where there is a special-purpose interactive mechanism. 
This interactive mechanism should be implemented using a custom Scene, most likely a subclass of Location, 
and there needs to be some element in myStory.json to indicate the presence of the mechanism. This mechanism could be many things. Some examples include:

    A radio which turns on and off, and gives one of several messages to the player.
    A dog you can pet which rolls over onto its tummy, or maybe goes and fetches an object...
    A button which opens a secret door.
    Some food you can eat, which bring back memories...

*/

var count = 0;      // count for number of pages flipped

class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); 
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); 
    }

}

class Location extends Scene {
    create(key) {
        // this.engine.storyData.Locations[key] = grabbing the location from the Locations dictionary 
        let locationData = this.engine.storyData.Locations[key];       
        
        this.engine.show(locationData.Body);
        // this.engine.storyData.Locations.Kresge.Body

        if (key == "Chelsey") {
            // get the key 
            this.engine.storyData.Key.push(1);

        }
        if (key == "My apartment" && this.engine.storyData.Key == 1) {
            this.engine.show("I can finally use the key to get back home");
            if (locationData.Choices.length == 1) {
                let dictionary1 = {"Text": "Elevator", "Target": "Apartment Room"};
                // make the new location visible
                this.engine.storyData.Locations["My apartment"].Choices.push(dictionary1);
            }
        }
        
        // locationData.Choices.length = length of the amount of choices available 
        if(locationData.Choices.length > 0) { 

            // location.Choices = the choice options from that specific location
            // choices is the index of the location's Choices 
            for(let choice of locationData.Choices) { 
                // this will allow the player to click on the direction text option, and based on that option,
                // the game should go to the next location based on the direction chosen
                this.engine.addChoice(choice.Text, choice); 
                // choice == choice index decided from player
                // second argument should be the next location
            }
        } 
        else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        // Going to different locations
        if(choice.Target != "Interact") {
            this.engine.show("&gt; " + choice.Text);        // prints the new Location
            this.engine.gotoScene(Location, choice.Target); // gonna go to Location function with the new location
        } 
        // interacting with an item at a location
        else if (choice.Target == "Interact") {
            // looping through interact list
            this.engine.show("&gt; " + choice.Text);
            if (choice.Text == "Flip through the pages.") {
                count += 1;
                if (count == 1) {
                this.engine.show("You flipped through " + count + " page.");
                }
                else {
                    this.engine.show("You flipped through " + count + " pages.");
                }

            }
            this.engine.gotoScene(Interact, this.engine.storyData.Locations["Book Store"].Interact);
        }

        // going to the ending and the credits 
        else {
            this.engine.gotoScene(End);
        }
    }
}

class Interact extends Location {
    create(key) {
        this.engine.show("Body: " + key.Body);

        if (key.Options.length > 0) {
            for (let options of key.Options) {
                //this.engine.show(options.Text + ": " + options.Target);
                this.engine.addChoice(options.Text, options);
            }
        }
        
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');