// src/pages/About.jsx
import React from "react";
import { uuidv4 } from "../utils/id.js";
import Timeline from "../components/Timeline.jsx";
import TokenCheck from "../components/TokenCheck.jsx";
import { SocialIcon } from "../components/SocialIcon.jsx";

export default function About() {
  const defaultTimeline = [
    { id: uuidv4(), when: "04/2023 to Present", what: "Full-Time Programmer in Octopus-InfoTech-Limited" },
    { id: uuidv4(), when: "10/2022 to 02/2023", what: "Part-Time IT Support in Hong Kong Institute of Construction" },
    { id: uuidv4(), when: "09/2019 to 09/2022", what: "IVE Software Engineer Graduate" },
    { id: uuidv4(), when: "09/2013 to 09/2019", what: "Secondary Graduate in TKWSS" },
  ];  

  const timelineItems = React.useMemo(
    () => defaultTimeline.map((t) => ({ id: t.id, header: t.when, body: t.what })),
    [defaultTimeline]
  );

  return (
    <section id="about">
      <div className="container">
        <h2>About me</h2>
        <div className="container creater">
          <div className="creater-card">
            <span className="tag">Welcome</span>
            <div className="row">
              <h1 id="createrName">
                Lam Chun Wing (Marco) 
              </h1>
              <div className="avatar center container" aria-label="Avatar" style={{flex:" 0 0 110px"}}>
                ML
              </div>
            </div>
            <p className="muted" id="createrTagline">
              2b || !2b — that is the question. 
            </p>
            <div className="spacer"></div>
            <div className="row">
              <span className="pill">
                <SocialIcon 
                  social="Gmail" 
                  text="marcolamCW1119@gmail.com"
                  url="mailto:marcolamCW1119@gmail.com" 
                />
              </span>
              <span className="pill">
                <SocialIcon 
                  social="Whatsapp" 
                  text="92087744"
                  url="https://wa.me/85292087744" 
                />
              </span>
              <span className="pill">
                <SocialIcon 
                  social="LinkedIn" 
                  text="Chun Wing Lam"
                  url="https://www.linkedin.com/in/chun-wing-lam-308ba4328" 
                />
              </span>
              <span className="pill">
                <SocialIcon 
                  social="Github" 
                  text="MarcoLam1119"
                  url="https://github.com/MarcoLam1119" 
                />
              </span>
              <span className="pill">
                <SocialIcon 
                  social="Instagram" 
                  text="marco_gaster_lam1119"
                  url="https://www.instagram.com/marco_gaster_lam1119?igsh=azZuc2p3dTBod3ow&utm_source=qr" 
                />
              </span>
              <span className="pill">
                <SocialIcon 
                  social="discord" 
                  text="mlgmobile"
                  url="https://discord.com/users/mlgmobile" 
                />
              </span>
            </div>
            <div className="divider"></div>
            <h3>Bio</h3>
            <p id="aboutBio">
              Hi, I'm Lam Chun Wing. I'm passionate about building useful things and sharing ideas. I enjoy working with the web, exploring design systems, and turning concepts into working prototypes. When I'm not at a keyboard, you can find me outdoors or with a good book.
            </p>
            <div className="divider"></div>
            <h3>Skills</h3>
            <div className="skills" id="skills">
              <span className="pill">HTML</span>
              <span className="pill">CSS</span>
              <span className="pill">JavaScript</span>
              <span className="pill">Java</span>
              <span className="pill">Python</span>
              <span className="pill">SQL</span>
              {/* <span className="pill"></span> */}
            </div>
          </div>
        </div>

        <div className="spacer"></div>

        <div className="row">
          <div className="panel timeline-chart">
            <h3>Timeline (Chart)</h3>
            <Timeline items={timelineItems} />
          </div>

          <div className="panel">
            <h3>Timeline</h3>
            <div className="timeline" id="timeline">
              {defaultTimeline.map((item) => (
                <div className="item" key={item.id} style={{ marginBottom: 10 }}>
                  <strong> {item.when} </strong>
                  <div className="muted"> {item.what} </div>
                </div>
              ))}
            </div>
            <div className="divider"></div>

          </div>

        </div>
      </div>
    </section>
  );
}