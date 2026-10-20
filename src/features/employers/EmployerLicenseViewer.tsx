"use client";
import BootstrapIcon from "../../components/ui/BootstrapIcon";

import { useRef } from "react";

const licenseDescription = "SLBFE licence No. 1162 issued to Emerald Isle Manpower and Travel Services";

export default function EmployerLicenseViewer() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return <>
    <figure className="employer-certificate">
      <button
        className="employer-certificate-crop"
        type="button"
        aria-label="Enlarge SLBFE licence No. 1162"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        <img src="/assets/slbfe-license-reference.png" alt={licenseDescription} width="1603" height="637" fetchPriority="high" />
      </button>
      <figcaption><span>View licence details <BootstrapIcon name="arrow-up-right" /></span><strong>SLBFE License No. 1162</strong></figcaption>
      <div className="employer-certificate-seal" aria-hidden="true"><strong>5</strong><span>Star<br />Award</span></div>
    </figure>

    <dialog
      ref={dialogRef}
      className="employer-license-dialog"
      aria-labelledby="employer-license-dialog-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <button className="employer-license-dialog__close" type="button" aria-label="Close licence viewer" onClick={() => dialogRef.current?.close()}>
        <span aria-hidden="true">×</span>
      </button>
      <h2 id="employer-license-dialog-title">SLBFE License No. 1162</h2>
      <div className="employer-license-dialog__document" role="img" aria-label={licenseDescription}>
        <img src="/assets/slbfe-license-reference.png" alt="" width="1603" height="637" />
      </div>
      <p>Issued to Emerald Isle Manpower &amp; Travel Services by the Sri Lanka Bureau of Foreign Employment.</p>
    </dialog>
  </>;
}
