import React, { useEffect, useState } from "react";
import { Button, Carousel, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./index.css";

const slides = [
  { src: "assets/img/IDCO_Onboarding.png", alt: "IDCO_Onboarding" },
  { src: "assets/img/Pop-Up_Change of Use.png", alt: "Change of Use" },
  { src: "assets/img/Pre approved plan popup 9.jpg", alt: "SUJOG pre-approved building plans", hasResources: true },
  { src: "assets/img/slide/Media.jpg", alt: "Trade licence and Shop and Establishment registration announcement" },
];

const PreApprovedInfoPopUp = () => {
  const [lgShow, setLgShow] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    // Preserve the existing 30-second automatic dismissal.
    const timeout = setTimeout(() => setLgShow(false), 30000);
    return () => clearTimeout(timeout);
  }, []);
  const openResource = (url) => window.open(url, "_blank", "noopener,noreferrer");
  const changeSlide = (direction) => setActiveIndex((current) => (current + direction + slides.length) % slides.length);
  const hasResources = Boolean(slides[activeIndex].hasResources);
  return (
    <>
      <Modal show={lgShow} onHide={() => setLgShow(false)} className="announcement-modal" backdropClassName="announcement-backdrop" aria-labelledby="announcement-title" centered>
        <Modal.Header>
          <Modal.Title as="h2" id="announcement-title">Important announcements</Modal.Title>
          <button type="button" className="announcement-close" aria-label="Close announcements" onClick={() => setLgShow(false)}><FontAwesomeIcon icon={faTimes} aria-hidden="true" /></button>
        </Modal.Header>
        <Modal.Body>
          <Carousel activeIndex={activeIndex} onSelect={setActiveIndex} interval={lgShow && !showOptions ? 6000 : null} controls={false} indicators={false} pause="hover" className="announcement-carousel">
            {slides.map((slide) => <Carousel.Item key={slide.src}><img src={slide.src} alt={slide.alt} /></Carousel.Item>)}
          </Carousel>
        </Modal.Body>
        <Modal.Footer>
          <div className="announcement-resources" style={{ visibility: hasResources ? "visible" : "hidden" }} aria-hidden={!hasResources}>
            <Button onClick={() => setShowOptions(true)} tabIndex={hasResources ? 0 : -1}>Watch tutorial</Button>
            <Button variant="outline-secondary" onClick={() => openResource("/Deshboard/images/Quick Guide Pre Approved Plan.pdf")} tabIndex={hasResources ? 0 : -1}>Quick guide</Button>
            <Button variant="outline-secondary" onClick={() => openResource("/Deshboard/images/SUJOG Pre Approved Plans User Manual.pdf")} tabIndex={hasResources ? 0 : -1}>User manual</Button>
          </div>
          <div className="announcement-navigation">
            <button type="button" className="announcement-arrow" aria-label="Previous announcement" onClick={() => changeSlide(-1)}><FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" /></button>
            <span className="announcement-count">{activeIndex + 1} / {slides.length}</span>
            <button type="button" className="announcement-arrow" aria-label="Next announcement" onClick={() => changeSlide(1)}><FontAwesomeIcon icon={faChevronRight} aria-hidden="true" /></button>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal show={showOptions} onHide={() => setShowOptions(false)} centered className="announcement-options" aria-labelledby="announcement-options-title">
        <Modal.Header>
          <Modal.Title as="h2" id="announcement-options-title">Watch a pre-approved plan tutorial</Modal.Title>
          <button type="button" className="announcement-close" aria-label="Close tutorial options" onClick={() => setShowOptions(false)}><FontAwesomeIcon icon={faTimes} aria-hidden="true" /></button>
        </Modal.Header>
        <Modal.Body>
          <p>Choose your preferred language.</p>
          <div className="announcement-resources">
            <Button onClick={() => openResource("https://youtu.be/2V1ssVuTsKM?si=2dFR6DgVL-0PFVjj")}>English Video</Button>
            <Button onClick={() => openResource("https://youtu.be/kIcorQHwHQA?si=OFjrfG6kgjA9DMg8")}>Odia Video</Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default PreApprovedInfoPopUp;
