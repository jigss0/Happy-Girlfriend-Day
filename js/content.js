/* =====================================================
   ALL ORIGINAL CONTENT LIVES HERE — NOTHING IS A PLACEHOLDER
===================================================== */

const DIARY_PAGES = [
  {
    title: "How You Changed My Life 🤍🧿",
    img: "diary1.jpg",
    decor: ["washi-tl","coffee-br"],
    text: "I used to think 'changing someone's life' meant something loud — a single dramatic moment you could point to later. You didn't do it like that. You did it by asking how my day actually went and then waiting for the real answer. You did it by making Sundays feel like an event instead of a gap between weeks. I didn't become a different person because of you. I became a more awake version of the one I already was. That's the part nobody tells you about real love."
  },
  {
    title: "The Little Things I Love",
    img: "diary2.jpg",
    decor: ["paperclip-tr","stamp-bl"],
    text: "You narrate your own decisions out loud, mid-thought, like I'm not even there — 'okay but if I wear this then I'll need the other shoes' — and I have never once interrupted because I don't want it to stop. You hum when you're concentrating and don't know you're doing it. You always give me the bigger half without announcing it, then act surprised when I notice.All of it is my favorite footage of you."
  },
  {
    title: "Gratitude",
    img: "diary3.jpg",
    decor: ["flower-tl","washi-br"],
    text: "Thank you for the version of patience you have with me that I have not always earned. Thank you for arguing with me like you actually want us to land somewhere better, not just win. Thank you for remembering the small, specific things and thank you enough for being witnessed this closely. So: thank you."
  },
  {
    title: "Apology",
    img: "diary4.jpg",
    decor: ["coffee-tl","paperclip-br"],
    text: "I am sorry for the nights I brought you my exhaustion instead of my attention, and let you mistake one for the other. I am sorry for the times I needed you to ask twice before I actually listened the first time. You have never once made your needs complicated, and I have occasionally made them feel that way by being slow to notice them."
  },
  {
    title: "Promise",
    img: "diary5.jpg",
    decor: ["stamp-tr","flower-bl"],
    text: "I promise to keep choosing the unglamorous parts of everything about you 🥺🧿🤍I promise that my love for you will keep being a decision I make on purpose, not a mood I happen to be in."
  },
  {
    title: "Future Dreams",
    img: "diary6.jpg",
    decor: ["washi-tr","coffee-bl"],
    text: "I think about a kitchen we'll argue in about nothing, a bookshelf that's half yours and half mine until neither of us can tell whose book is whose anymore.I think about you getting to do the version of your life you actually want, and me getting to stand next to you clapping the loudest in the room. None of it needs to be extraordinary."
  },
  {
    title: "Forever",
    img: "diary7.jpg",
    decor: ["flower-tr","paperclip-bl"],
    text: "Now I think forever just means: I will keep showing up tomorrow, and the day after, in the small, unglamorous, completely un-cinematic way that real love actually works. Not because it's easy. Because it's you. That's the whole diary, Anjani. Every page was just a longer way of saying the same four words: I choose you always."
  }
];

const GALLERY_ITEMS = [
  { type:"polaroid", rot:-6, top:"2%", left:"4%", w:280, caption:"Bestest day of my life 🤍", img:"gallery1.jpg" },
  { type:"polaroid", rot:5, top:"3%", left:"54%", w:300, caption:"the photo you loved the most 😩", img:"gallery2.jpg" },
  { type:"filmstrip", rot:-3, top:"40%", left:"32%", w:170, caption:"wanna see you like this always ❤️", img:"gallery3.jpg" },
  { type:"polaroid", rot:6, top:"68%", left:"6%", w:280, caption:"Lagi re .. lagi re .. tari dhun laagi 🎶", img:"gallery4.jpg" },
  { type:"polaroid", rot:-5, top:"70%", left:"54%", w:300, caption:"Lovey dovey moments 🥺", img:"gallery5.jpg" },
];

const ENVELOPES = [
  {
    id:"miss", label:"Open When You Miss Me", title:"For The Distance, Whenever It Shows Up",
    body:"Missing someone is just love with nowhere to go for a while. If you're reading this, some part of you wishes I were closer right now, and honestly, some part of me probably does too. Here's what's true and won't change: distance is temporary, and you are always the first person I want to tell things to. Go look at the last photo we took together. Notice how unposed it is."
  },
  {
    id:"angry", label:"Open When You're Angry", title:"For When You're Furious — At Me Or At Anything Else",
    body:"If it's me you're angry with, I want you to know that I would rather hear the unfiltered version of your frustration than a polite, edited one. I can handle it. Say the true thing. If it's not about me — if the world did something unfair to you today and Be as loud as you need to be, and then, whenever you're ready, come find me. I'm not going anywhere, and I'm not scared of your anger."
  }
];

const SCRATCH_CARDS = [
  { id:"impression", title:"First Impression", img:"scratch1.jpg", text:"I thought you were the kind of person who already had somewhere better to be — and then you stayed anyway, and asked me a real question instead of a small one." },
  { id:"memory", title:"Favourite Memory", img:"scratch2.jpg", text:"The night the power went out and we just talked by candlelight until 3 a.m. about nothing important, and it somehow became the most important night I can remember." },
  { id:"photo", title:"Favourite Photo Of You", img:"scratch3.jpg", text:"The blurry one where you're mid-laugh, eyes almost shut, hand halfway to your face — the one where you weren't posing at all, just being completely, unguardedly you." },
  { id:"admire", title:"What I Admire Most", img:"scratch4.jpg", text:"How you keep choosing kindness even on days the world has been unkind to you first. That's not softness. That's the quiet, unglamorous kind of strength." },
  { id:"promise", title:"My Promise", img:"scratch5.jpg", text:"I will never let 'busy' become an excuse for 'distant.' I will keep making room for you, on purpose, for as long as you'll let me." },
  { id:"letter", title:"Hidden Love Letter", img:"scratch6.jpg", text:"If you're reading this, you scratched through the last one on purpose and Happy Girlfriend Day, Anjani. Every layer under this one is still just: I love you." }
];
