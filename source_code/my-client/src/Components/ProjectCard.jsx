import React, { useRef, useEffect, useState } from "react";

const ProjectCard = (props) => {
    const cardBorderRef = useRef(null);
    const [fontSize, setFontSize] = useState("1rem"); // Default font size

    useEffect(() => {
        const updateFontSize = () => {
            if (cardBorderRef.current) {
                const cardBorderWidth = cardBorderRef.current.offsetWidth;
                const calculatedFontSize = (cardBorderWidth * 0.03) + 1 + "px"; // Example: 5% of card-border width
                setFontSize(calculatedFontSize);
            }
        };

        updateFontSize(); // Initial calculation
        window.addEventListener("resize", updateFontSize); // Recalculate on window resize

        return () => {
            window.removeEventListener("resize", updateFontSize); // Clean up event listener
        };
    }, []); // Empty dependency array

    const view = () => {
        if (props.project) {
            props.view(props.project);
        }
    };

    if (props.project) {
        return (
            <div id="card-border" ref={cardBorderRef} onClick={view}>
                <div className="card border-secondary mb-3" id="card">
                    <div className="card-header">
                        {props.project.title ? props.project.title : "Project Name"}
                    </div>
                    <div className="card-body text-secondary">
                        <div id="project-preview">
                            {/* eslint-disable-next-line */}
                            <img
                                src={props.project.icon}
                                alt="Loading Image..."
                                width="150px"
                                height="150px"
                                id="card-img"
                                onError={(event) => {
                                    event.target.src = "default-img.jpg";
                                    event.onerror = null;
                                }}
                            />
                            <p id="card-desc" style={{ marginLeft: "10px", fontSize: fontSize }}>
                                {props.project.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default ProjectCard;
