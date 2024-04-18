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
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);

        if (!this.engine.completedActions) {
            this.engine.completedActions = new Set();
        }

        if (this.engine.jailBreakAttempted === undefined) {
            this.engine.jailBreakAttempted = false;
        }

        if (key === "Jail Break") {
            this.engine.jailBreakAttempted = true;
            this.engine.addChoice("Stop and hide", () => ({ Text: "Stop", Target: "Stop" }));
            this.engine.addChoice("Keep digging", () => ({ Text: "Continue", Target: "Game Over" }));
        } else if (key === "Stop") {
            this.engine.addChoice("Continue digging", () => ({ Text: "Start digging again", Target: "Digging Again" }));
        } else {
            if (!this.engine.jailBreakAttempted && this.engine.completedActions.has('Eat') && this.engine.completedActions.has('Sleep') && this.engine.completedActions.has('Work')) {
                this.engine.addChoice("Attempt to break out of jail", () => ({ Text: "Jail Break", Target: "Jail Break" }));
            } else {
                if (locationData.Choices) {
                    locationData.Choices.forEach(choice => {
                        this.engine.addChoice(choice.Text, () => choice);
                    });
                } else {
                    this.engine.addChoice("The end.");
                }
            }
        }
    }

    handleChoice(choiceFn) {
        const choice = choiceFn();
        this.engine.show("> " + choice.Text);

        if (["Eat", "Sleep", "Work"].includes(choice.Text)) {
            this.engine.completedActions.add(choice.Text);
        }
        this.engine.gotoScene(Location, choice.Target);
    }
}


class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
