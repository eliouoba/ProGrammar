export default class Room {
    
    constructor(name) {
        this.name = name;
    }

   /** Join this room */
   join(user){}

    /** Generates a web link that allows other users to join this room  */ 
   generateLink(){}

   /** Sends an invite link to the specified destination email address */ 
   generateEmail(link, destination){}

   /** Updates the state of the room as users join */ 
   update(){}

}