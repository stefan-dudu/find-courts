import React from "react";
import "./HowItWorks.scss";

type Props = {};

const HowItWorks = (props: Props) => {
  return (
    <div className="howItWorksParent">
      <h1>Cum functioneaza?</h1>
      <p>Acest site funcționează pe baza check-in-urilor utilizatorilor.</p>
      <p>
        Check-in-ul se poate face prin scanarea codului QR disponibil pe terenul
        de tenis. Pentru a evita anumite neplaceri, check-in-ul se poate face
        doar daca te afli in proximitatea terenului.
      </p>
      <p>
        Când cineva face check-in pe teren, ceilalți jucători vor ști că terenul
        este deja ocupat.
      </p>
      <p>
        Astfel, site-ul ajută la gestionarea disponibilității terenurilor și la
        evitarea confuziilor între cei care vor să joace
      </p>
      <p>
        Dacă un utilizator nu face check-in, site-ul va arăta că terenul este
        liber, chiar dacă nu este. Așadar, este important să faci check-in
        înainte de a juca, pentru ca ceilalți să știe că terenul este ocupat.
      </p>
    </div>
  );
};

export default HowItWorks;
