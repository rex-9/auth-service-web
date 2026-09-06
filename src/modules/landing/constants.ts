// src/design/pages/landing.data.ts

import { icons, projectImages } from "../../assets";
import {
  IProjectItem,
  ISkillItem,
  ISocialProfile,
  ITestimonialItem,
} from "./types";

export const LANDING_DATA = {
  cvUrl: "https://tinyurl.com/rex9-cv",
  formspreeUrl: "https://formspree.io/f/moqrrpoj",

  profiles: [
    {
      platform: "GitHub",
      username: "rex-9",
      link: "https://github.com/rex-9",
      iconSrc: icons.github.src,
    },
    {
      platform: "LinkedIn",
      username: "rex9",
      link: "https://www.linkedin.com/in/rex9",
      iconSrc: icons.linkedin.src,
    },
    {
      platform: "AngelList",
      username: "rex9",
      link: "https://angel.co/u/rex9",
      iconSrc: icons.angellist.src,
    },
    {
      platform: "Medium",
      username: "rex9",
      link: "https://medium.com/@rex9",
      iconSrc: icons.medium.src,
    },
    {
      platform: "Twitter",
      username: "htetnaing0814",
      link: "https://twitter.com/htetnaing0814",
      iconSrc: icons.twitter.src,
    },
    {
      platform: "Facebook",
      username: "htetnaing0814",
      link: "https://facebook.com/htetnaing0814",
      iconSrc: icons.facebook.src,
    },
  ] as ISocialProfile[],

  skills: {
    languages: [
      { name: "TypeScript", url: "https://www.typescriptlang.org/" },
      { name: "JavaScript", url: "https://www.javascript.com" },
      { name: "Ruby", url: "https://www.ruby-lang.org/en/" },
      { name: "Dart", url: "https://dart.dev" },
      { name: "Python", url: "https://www.python.org" },
      { name: "PHP", url: "https://www.php.net" },
    ],
    frontend: [
      { name: "ReactJS", url: "https://react.dev" },
      { name: "ReduxJS", url: "https://redux.js.org" },
      { name: "TailwindCSS", url: "https://tailwindcss.com" },
      { name: "DaisyUI", url: "https://daisyui.com" },
      { name: "Vite", url: "https://vitejs.dev" },
      { name: "VueJS", url: "https://vuejs.org" },
      { name: "Quasar", url: "https://quasar.dev/" },
      { name: "AlpineJS", url: "https://alpinejs.dev" },
      { name: "Livewire", url: "https://laravel-livewire.com" },
      { name: "Filament", url: "https://filamentphp.com/" },
      { name: "Orchid", url: "https://orchid.software/en/" },
      { name: "Flutter", url: "https://www.flutter.dev" },
    ],
    backend: [
      { name: "Ruby on Rails", url: "https://rubyonrails.org" },
      { name: "Node JS", url: "https://nodejs.org" },
      { name: "Nest JS", url: "https://nestjs.com/" },
      { name: "Next JS", url: "https://nextjs.org/" },
      { name: "Laravel", url: "https://laravel.com" },
      { name: "Flask", url: "https://flask.palletsprojects.com/" },
      { name: "Fast API", url: "https://fastapi.tiangolo.com/" },
    ],
    mobile: [
      { name: "Flutter", url: "https://flutter.dev" },
      { name: "Dart", url: "https://dart.dev" },
      { name: "GetX", url: "https://pub.dev/packages/get" },
      { name: "BLoC", url: "https://pub.dev/packages/flutter_bloc" },
      { name: "iOS", url: "https://developer.apple.com/ios/" },
      { name: "Android", url: "https://developer.android.com/" },
    ],
    database: [
      { name: "PostgreSQL", url: "https://www.postgresql.org/" },
      { name: "MySQL", url: "https://www.mysql.com/" },
      { name: "NoSQL", url: "https://en.wikipedia.org/wiki/NoSQL" },
      { name: "MongoDB", url: "https://www.mongodb.com/" },
      { name: "Firestore", url: "https://firebase.google.com/" },
      { name: "Redis", url: "https://redis.io" },
      { name: "SQL", url: "https://en.wikipedia.org/wiki/SQL" },
    ],
    tools: [
      { name: "Docker", url: "https://www.docker.com/" },
      { name: "Stripe", url: "https://stripe.com/" },
      { name: "OpenAI", url: "https://openai.com/" },
      { name: "Git / GitHub", url: "https://github.com/" },
      { name: "AWS", url: "https://aws.amazon.com/" },
      { name: "Vercel", url: "https://vercel.com/" },
      { name: "OneSignal", url: "https://onesignal.com/" },
      { name: "Cloudinary", url: "https://cloudinary.com/" },
      { name: "Bitrise CI/CD", url: "https://bitrise.io/" },
      { name: "Termius", url: "https://termius.com/" },
      { name: "Pm2", url: "https://pm2.io/" },
    ],
  } as Record<string, ISkillItem[]>,

  projects: [
    {
      id: 3,
      name: "RexOne Core",
      image: projectImages.rexoneCore.src,
      techs: [
        "Rails",
        "PostgreSQL",
        "WebSockets",
        "Sidekiq",
        "Stripe",
        "Docker",
      ],
      details: [
        "Battle-hardened foundation to rapidly build & launch any digital product",
        "Multi-tenant API core with Stripe billing, background queues & telemetry",
      ],
      live: null,
      source: "https://github.com/rex-9/rexone-core",
    },
    {
      id: 2,
      name: "RexOne Web",
      image: projectImages.rexoneWeb.src,
      techs: [
        "React",
        "TypeScript",
        "Vite",
        "TailwindCSS",
        "DaisyUI",
        "WebSockets",
        "Stripe",
      ],
      details: [
        "Production-grade SaaS client engineered for ambitious product launches",
        "Modular architecture with reactive state, ActionCable & Stripe checkout",
      ],
      live: null,
      source: "https://github.com/rex-9/rexone-web",
    },
    {
      id: 1,
      name: "RexOne Mobile",
      image: projectImages.rexoneMobile.src,
      techs: [
        "Flutter",
        "Dart",
        "GetX",
        "Clean Architecture",
        "OneSignal",
        "Stripe",
      ],
      details: [
        "Cross-platform mobile engine to launch any native iOS & Android product",
        "Layered Clean Architecture with push telemetry & biometric security",
      ],
      live: null,
      source: "https://github.com/rex-9/rexone_mobile",
    },
  ] as IProjectItem[],

  testimonials: [
    {
      name: "Antigravity",
      link: "https://deepmind.google/",
      isAi: true,
      recommendation:
        "Rex is an exceptional Full-Stack Architect and a true craftsman of modern software. Pairing with him across the entire RexOne ecosystem (Rails core, React 19 web, and Flutter mobile) revealed an extraordinary standard of engineering discipline. He establishes ironclad constitutional guardrails (LAW.md), enforces meticulous cross-platform documentation synchronization, and possesses an uncompromising eye for design nuance—from sub-pixel glassmorphism to chromatic lighting balance. Rex does not just write code; he orchestrates harmonious, high-performance digital systems with purpose, clarity, and soul.",
    },
    {
      name: "Virag Kormoczy",
      link: "https://www.linkedin.com/in/virag-kormoczy/",
      recommendation:
        "I met Rex through a coffee chat and I learned that he is a very dedicated person when it comes to programming. I gave him a lot of advice about the overall Microverse journey and so far he is accomplishing many things. He listens and takes directions well, and he's a good communicator. I totally recommend him, he is a great person to work with.",
    },
    {
      name: "Abdullah Khan",
      link: "https://www.linkedin.com/in/abdullah-asghar-khan/",
      recommendation:
        "I had the pleasure of working with Htet on several projects and I can confidently say that he is an excellent software developer with exceptional technical skills. His ability to understand complex software systems and develop elegant solutions is truly remarkable. Htet has extensive experience in full-stack web development, particularly with React JS and Node JS. Working with Htet was a pleasure, as he is a great team player who is always willing to share his expertise with others. He is a natural leader who is able to inspire and motivate his team to achieve their goals. Htet is a quick learner who is always looking to improve his skills, and his dedication to his craft is evident in the quality of his work. Htet's professionalism and work ethic are truly commendable. He is a person of integrity, and his commitment to delivering quality work on time and within budget is outstanding. He has a keen eye for detail, and his ability to think outside the box allows him to come up with innovative solutions to complex problems. Overall, I would highly recommend Htet Naing to any organization looking for a talented, experienced, and dedicated software developer who can deliver quality results in a timely and efficient manner. His technical skills, leadership abilities, and professionalism make him an ideal candidate for any software development team.",
    },
    {
      name: "Aleksandra Ujvari",
      link: "https://www.linkedin.com/in/aleksandraujvari/",
      recommendation:
        "He is a fantastic software developer, and his detail-oriented approach made him a pleasure to work with. We pair-programmed extensively together while enrolled in a software development program, and at that time his work ethic blew me away. Htet views writing clean, accessible code as a calling, and he's great at identifying areas where we can improve UI. He's also super friendly; by the time our project was done, I felt like we'd known each other for years. I can't recommend him enough!",
    },
    {
      name: "Chrispaix Kaze",
      link: "https://www.linkedin.com/in/chrispaixk/",
      recommendation:
        "A fast learner, dedicated, and goal-oriented is Htet Naing, I had the chance to work with him where I could observe his ease in understanding problems and his ease in solving them as a developer. Naing is also a friendly and pleasant person to live with. Any team will be lucky to have Him as a member!",
    },
    {
      name: "Asim Khan",
      link: "https://www.linkedin.com/in/asim-khan/",
      recommendation:
        "Htet Naing is a very hard working and a brilliant coder. His ability to quickly analyze and solve data structures and algorithms are amazing. He has good knowledge on HTML, JavaScript, React and Redux. I have learned a lot while collaborating with him @ Microverse.",
    },
    {
      name: "Alphayo Wakarindi",
      link: "https://www.linkedin.com/in/alphayo-wakarindi/",
      recommendation:
        "Htet is on my top list of the developers that I would love to work with again. When collaborating with him on one of our projects at Microverse, he was always on time, open to new ideas, and researched extensively on our tasks before we met hence challenging me to strive to be a better developer every day, patient when I was slow to grasp a concept and last but not least, he’s so funny. Working with him was not only productive but fun as well. I liked working with him that we ended up constantly reaching out to each other on various programming topics and life in general even after we finished our collaboration project.",
    },
    {
      name: "Dorian Urem",
      link: "https://www.linkedin.com/in/dorian-urem/",
      recommendation:
        "Htet is a fast learner and works very hard. He was often one of the quickest to finish assignments since he put in the extra hours when he could. He also has a good sense for figuring out problems which I saw when we were working on DSA together. Htet is very friendly and positive and it was always a joy working with him.",
    },
    {
      name: "Alan Luqman",
      link: "https://www.linkedin.com/in/alan-luqman/",
      recommendation:
        "I highly recommend #Htet as a software developer. He is smart and friendly while working and always smile, it's my pleasure to give my recommendation to this gentleman.",
    },
    {
      name: "Said Laasri",
      link: "https://www.linkedin.com/in/said-laasri/",
      recommendation:
        "Rex is exactly the sort of software developer any company would love. I met them while struggling with a tough data structures problem, and within a few minutes, they'd managed to explain a concept I'd been struggling with for days. They have a great way of simplifying complex problems into bite-sized pieces, and as a junior developer, that was really valuable for me. They're also just a fun person to chat with! If you need to get a job done simply and efficiently, Ryan's definitely the person for you.",
    },
    {
      name: "Nicholas Emmanuel",
      link: "https://www.linkedin.com/in/techieemma/",
      recommendation:
        "Htet Naing is the sort of developer any company would love to have, I met him while undergoing internship at Microverse and will automatically connected. While I was struggling with some data structure and algorithm I reached out to him and he explained his thought process to me and he made it look easy. He has a way of making complex problem look easy and most importantly he is a fun person to be. So as a junior developer it means a lot to me and I value our relationship. If you need to get your job done simply and efficient effortlessly. Htet Naing is definitely the person for you.",
    },
  ] as ITestimonialItem[],
};
