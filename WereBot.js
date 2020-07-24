const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
//https://discordapp.com/oauth2/authorize?client_id=714878111031885845&scope=bot

function init(){
    Chan = undefined
    CardVals = [];
    CardIndexes = [];
    Active = [];
    ActivePlayers = [];
    Pointer = 0;
    ReadyPlayers = [];
    ReadyPlayersSet = false;
    Thumbs = [];
    Bumps = [];
    SwapVal = [];
    Marks = [];
    InitialSetup = "";
  }
function say(Msg){
    Chan.send(':' + Msg);
  }
function getCardVal(CardName){
    return CardVals[CardIndexes[CardName]];
  }
function getInitVal(CardName){
    return InitialSetup[CardIndexes[CardName]];
}
function getMarkVal(MarkName){
    return Marks[CardIndexes[MarkName]];
}
function setCard(CardName, CardValue){
    if (Active.includes(CardName)){
      CardVals[CardIndexes[CardName]] = CardValue;
      //if card is already active, check its index and set it to CardValue
    } else {
      CardIndexes[CardName] = Pointer;
      Pointer = CardVals.push(CardValue);
      Active.push(CardName);
      //else set index to Pointer for next value, define that next value as CardValue, update Pointer and add to active
    }
  }
function setMark(MarkName, MarkValue){
    if (Active.includes(MarkName)){
      Marks[CardIndexes[MarkName]] = MarkValue;
      return true
    } else {
      return false
    }
}
function setMany(CardNameList,CardValueList,AssignMarks){
  if(ReadyPlayersSet = false){
    return("readyplayers first you stinky lemon")
  }
    CardsNum = CardNameList.length
    if (CardsNum != CardValueList.length){
      return(`Length mismatch! ${CardsNum} roles required for ${CardsNum - 3} player game, ${CardValueList.length} were given`);
    }
    for (i = 0; i < CardsNum; i++){
      setCard(CardNameList[i],CardValueList[i])
/*      if (AssignMarks === "yes"){
        setMark(CardNameList[i], "clarity");
      }*/
    }
    ActivePlayers = Active.slice(3,Active.length);
    if (AssignMarks === "yes"){
      setMarks()
      return "roles and marks have been dealt to all players"
    } else {
      return "roles have been dealt to all players"
    }
  }
function setMarks(){
  for (Name of ActivePlayers){
    setMark(Name,"clarity");
  }
}
function swapCards(CardName1, CardName2){
    if(Active.includes(CardName1) && Active.includes(CardName2)){
      SwapVal = getCardVal(CardName1);
      setCard(CardName1, getCardVal(CardName2));
      setCard(CardName2, SwapVal);
      return true
    } else {
      return false
    }
  }
  function swapMarks(MarkName1, MarkName2){
      if(Active.includes(MarkName1) && Active.includes(MarkName2)){
        SwapVal = getMarkVal(MarkName1);
        setMark(MarkName1, getMarkVal(MarkName2));
        setMark(MarkName2, SwapVal);
        return true
      } else {
        return false
      }
    }
function shuffle(Array){
    for( i = Array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = Array[i];
      Array[i] = Array[j];
      Array[j] = temp;
    }
  }
function thumb(Direction, Name){
    if(!ActivePlayers.includes(Name)){
      return `${Name} is not in the game`
    }
    switch (Direction){
      case "up":
        if (Thumbs.includes(Name)){
          return `${Name}\'s thumb already up`;
        } else {
          Thumbs.push(Name);
          return `${Name}\'s thumb put up`;
        }
        break;
      case "down":
        if (Thumbs.includes(Name)){
          for( var i = 0; i < Thumbs.length; i++){
            if(Thumbs[i] === Name){
              Thumbs.splice(i,1);
            }
          }
          return `${Name}\'s thumb put down`;
        } else {
          return `${Name}\'s thumb already down`;
        }
      default:
        return "error, enter !thumb up name, or !thumb down name"
    }
  }
  function bump(CheckBump, Name){
    if(!ActivePlayers.includes(Name)){
      return `${Name} is not in the game`
    }
    if(!CheckBump){
      if(Bumps.includes(Name)){
        return `${Name} has already been bumped`;
      } else {
        Bumps.push(Name);
        return `bumping ${Name}`;
      }
    } else {
      if (Bumps.includes(Name)){
        for( var i = 0; i < Bumps.length; i++){
          if(Bumps[i] === Name){
            Bumps.splice(i,1);
          }
        }
        return `${Name} has been bumped`;
      } else {
        return `${Name} has not been bumped`;
      }
    }
  }




client.on("ready", () => {
  init();
  console.log("I am ready!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const dirtyargs = message.content.slice(config.prefix.length).trim().split(/ +/g);
  args = []
  for (arg of dirtyargs){
    args.push(arg.toLowerCase());
  }
  const command = args.shift().toLowerCase();
  Chan = message.channel;
//  Chan = message.Channel;

  switch (command) {
    case "ping":
      Chan.send("pong!");
      break;

    case "owo":
      Chan.send("UwU");
      break;

      case "uwu":
        Chan.send("OwO");
        break;

    case "set":
      //!set CardName CardValue
      setCard(args[0],args[1]);
      say(`card ${args[0]} set to ${args[1]}`);
      break;


    case "setmark":
      if(setMark(args[0],args[1])){
        say(`${args[0]}\'s mark set to ${args[1]}`);
      } else {
        say(`${args[0]} is not in the game`);
      }
      break;

    case "viewcard":
    case "view":
      // !view cardname
      if (Active.includes(args[0])){
        say(`you see ${args[0]} as ${getCardVal(args[0])}`);
      } else {
        say(`${args[0]} is not in the game`);
      }
      break;

    case "reveal":
      if (Active.includes(args[0])){
        AnnounceChan.send(`:${args[0]} is revealed as the ${getCardVal(args[0])}`)
      } else{
        say(`${args[0]} is not in the game`);
      }
      break;

    case "announce":
      AnnounceChan.send(`:${args.join(" ")}`);
      break;

    case "viewmark":
      // !view markname
      say(`${args[0]} has a mark of ${getMarkVal(args[0])}`);
      break;

    case "swapcards":
    case "swap":
      // !swap cardname1 cardname 2
      // swaps values of 2 cards
      if(swapCards(args[0],args[1])){
        say(`cards ${args[0]} and ${args[1]} swapped`);
      } else {
        say(`either ${args[0]} or ${args[1]} is not in the game`)
      }
      break;

      case "swapmarks":
        // !swap markname1 markname 2
        // swaps values of 2 marks
        if(swapMarks(args[0],args[1])){
          say(`${args[0]} and ${args[1]}\'s marks swapped`);
        } else {
          say(`either ${args[0]} or ${args[1]} is not in the game`)
        }
        break;

    case "readyplayers":
      // !readyplayers Jessie Liz Ros etc
      ReadyPlayers = args;
      ReadyPlayers.splice(0,0,'a','b','c');
      ReadyPlayersSet = true;
      say(`${ReadyPlayers.length - 3} players ready`)
      break;

    case "readymarks":
      setMarks();
      say("marks have been dealt to all players");
      break;

    case "rolelist":
      // !rolelist wolf seer pirate etc
      if(ReadyPlayersSet = false){
        say("readyplayers first");
        break;
      }
      if (args[0] === "yes" || args[0] === "no"){
        UseMarks = args.shift();
      } else {
        UseMarks = "no";
      }
      say(setMany(ReadyPlayers,args,UseMarks))
      InitialSetup = "";
      for (Name of Active){
        Cardval = getCardVal(Name);
        InitialSetup += new String(`${Name} = ${Cardval}\n`);
      }
      shuffle(CardVals)
      break;

    case "viewallcards":
    case "viewall":
      outmsg = ""
      for ( name of Active){
        role = getCardVal(name);
        outmsg += `${name} = ${role}\n`;
      }
      say(outmsg)
      break;

    case "viewinitialroles":
      say(InitialSetup)
      break;

    case "viewallmarks":
      outmsg = "";
      for (name of ActivePlayers){
        markval = getMarkVal(name);
        outmsg += `${name} = ${markval}\n`;
      }
      say(outmsg)
      break;

    case "thumbs":
    case "thumb":
      say(thumb(args[0],args[1]));
      break;

    case "viewallthumbs":
    case "viewthumb":
    case "viewthumbs":
      say(`you see: ${Thumbs.join(", ")}\'s Thumbs`)
      break;

    case "bump":
      say(`${bump(false, args[0])}`)
      break;

    case "checkbump":
      say(`${bump(true, args[0])}`)
      break;

    case "playerorder":
      say(`player order: ${ActivePlayers.join(", ")}`)
      break;

    case "reset":
    case "clear":
      say(`the table is clear`);
      init();
      break;

    case "setannouncechannel":
      AnnounceChan = Chan;
      say("announcements will be said here");
      break;

    case "debugcards":
      say(`cards = [${CardVals.toString()}]`);
      break;

    case "debugactive":
      say(`active = [${Active.toString()}]`);
      break;

    case "help":
      switch (args[0]){
        case "view":
          say(`---!view CardPosition---
This command allows you to view any card by inputting the players name or a/b/c. WereBot should respond with 'you see X as Y'. If WereBot responds with the error message 'you see X as undefined' you may have made a typo in the player's name or named a player not in the game, in which case try retyping the command. Note this command can only view one card at a time, so for example a seer may need to enter this command twice.

*(examples: !view ros, 'WereBot: you see ros as wolf', !view b, 'WereBot: you see b as pirate')*`)
          break;

        case "reveal":
          say(`---!reveal CardPosition---
This command works the exact same as !view EXCEPT werebot will announce the cards role in the announcemant channel instead of just replying to you`)
          break;

        case "swap":
          say(`---!swap CardPosition1 CardPosition2---
This command allows you to swap any 2 cards on the table by listing them. WereBot should respond with 'cards X and Y swapped'. If WereBot responds with 'either bob or uwu is not in the game' or 'either bob or undefined is not in the game', then you may have made a typo or are tying to swap the card of someone who is not in this game, in which case try retyping your command.

*(examples: !swap c burch, 'WereBot: cards c and burch swapped')*
`)
          break;

        case "thumb":
          say(`---!thumb up/down name---
This command allows you to raise or lower your thumb at any point during the game by inputting either up or down and your name (for example this will be used when werewolves are called to raise their thumbs). If your thumb is up, you will be listed under the !viewthumbs command.
If WereBot responds with 'X is not in the game' you likely have mistyped your name, in which case just rectify the typo and resend the command.

NB: Remember to lower your thumb when called to!
*(examples: !thumb up jessie, 'WereBot: jessie's thumb put up', !thumb down jessie, 'WereBot: jessie's thumb put down'!, thumb down jessie, 'WereBot: jessie's thumb already down', !thumb up borch, 'WereBot: borch is not in the game')*`)
          break;

        case "viewthumbs":
          say(`---!viewthumbs---
This command allows you to see who's thumbs are currently raised. One time you may use this when playing as a werewolf to see who your teammates are. If WereBot responds with 'you see thumbs as undefined', you've probably typed !view thumbs by accident.

*(examples: !viewthumbs, 'Werebot: you see borch, nathan, jessie's thumbs')*`)
          break;

        case "bump":
          say(`---!bump PlayerName
This command allows you to bump a player`)

        case "checkbump":
          say(`---!bump PlayerName
This command allows you to check if you have been bumped since the last time you checked, or the table was cleared`)

        case "setmark":
          say(`---!setmark PlayerName MarkName---
This command allows you to give a mark to a player, overwriting their previous mark (may be used as the assassin for example). If WereBot responds with 'X is not in the game' you may have mistyped someones name. If WereBot responds with 'X's mark set to undefined' you may have forgotten to put in a mark, in this case, resend the command with the correct mark.

*(examples: !setmark harri disease, 'WereBot: harri's mark set to disease')*`)
          break;

        case "swapmarks":
          say(`---!swapmarks Player1 Player2---
This command allows you to swap any 2 marks on the table by listing them. WereBot should respond with 'X and Y's marks swapped'. If WereBot responds with 'either bob or owo is not in the game' or 'either bob or undefined is not in the game', then you may have made a typo or are trying to swap the mark of someone who is not in this game or a middle card's non existent mark, in which case try retyping your command.

*(examples: !swapmarks harri burch, 'WereBot: harri and burch's marks swapped')*`)
          break;

        case "viewmark":
          say(`---!viewmark PlayerName---
This command allows you to view any mark by inputting a players name. WereBot should respond with 'X has a mark of Y'. If WereBot responds with the error message 'X has a mark of undefined' you may have made a typo in the player's name or named a player not in the game, in which case try retyping the command.

*(examples: !viewmark nathan, 'WereBot: nathan has a mark of clarity')*`)
          break;

        default:
          say  (`---Talking to WereBot---
Click on WereBot and send it a direct message to start a conversation. WereBot can be interacted with via DM's for privacy!

---SETUP COMMANDS---
!readyplayers player1 player2 player3 etc
!rolelist (marks)yes/no role1 role2 role3 etc
!readymarks
!viewall
!viewallmarks
!set CardPosition RoleName
!setannouncechannel
!announce Important message that can have spaces
---PLAYER COMMANDS---
!view CardPosition
!swap CardPosition1 CardPosition2
!swapmarks CardPosition1 CardPosition2
!setmark PlayerCard MarkName
!viewmark PlayerCard
!thumb up/down name
!viewthumbs
!reveal CardPosition
!bump PlayerName
!checkbump PlayerName


!help PlayerCommand (ie: !help view) use this for more information on player commands

NB: don't put spaces in any name!`)
      }
  }
});

client.login(config.token);
