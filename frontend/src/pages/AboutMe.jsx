import React from 'react';

export default function AboutMe() {
  return (
    <main id='adout-me'>
      <h1>About Me</h1>
      <p>Hi! I'm Marco, a software engineer with a passion for web development and game design.</p>
      <p>In my free time, I enjoy creating games and exploring new technologies.</p>
      <p>Feel free to check out my projects and connect with me!</p>
      <p>Contact:</p>
      
      <SocialIcon social="Gmail" url="mailto:marcolamCW1119@gmail.com" />
      <SocialIcon social="LinkedIn" url="https://www.linkedin.com/in/chun-wing-lam-308ba4328" />
      <SocialIcon social="GitHub" url="https://github.com/MarcoLam1119" />
      <SocialIcon social="Instagram" url="https://www.instagram.com/marco_gaster_lam1119?igsh=azZuc2p3dTBod3ow&utm_source=qr" />
      <SocialIcon social="Discord" url="https://discord.com/users/mlgmobile" />
      <SocialIcon social="Whatsapp" url="https://wa.me/85292087744" />
      
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