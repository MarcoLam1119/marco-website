import React from 'react';

export default function AboutMe() {
  return (
    <main>
      <h1>About Me</h1>
      <p>Hi! I'm Marco, a software engineer with a passion for web development and game design.</p>
      <p>In my free time, I enjoy creating games and exploring new technologies.</p>
      <p>Feel free to check out my projects and connect with me!</p>
      <p>Contact:</p>
      
      <SocialIcon social="Gmail" url="mailto:your-email@gmail.com" />
      <SocialIcon social="LinkedIn" url="https://www.linkedin.com/in/your-profile" />
      <SocialIcon social="GitHub" url="https://github.com/your-username" />
      <SocialIcon social="Instagram" url="https://instagram.com/your-profile" />
      <SocialIcon social="Discord" url="https://discord.com/users/marcolam1119" />
      <SocialIcon social="Whatsapp" url="https://wa.me/your-number" />
      
    </main>
  );
}

export function SocialIcon(props) {
  return (
    <a href={props.url} style={{ margin: '0 10px' }}>
      <img src={`/src/assets/icon/${props.social}_Original.svg`} alt={`${props.social} icon`} />
      {/* {props.social} */}
    </a>
  );
}