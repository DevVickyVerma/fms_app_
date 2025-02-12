import React from "react";
import { IonButton, IonIcon } from "@ionic/react";

const mobileButton = ({ onClick, text, icon, color = "primary", expand = "full", size = "small", className = "" }) => {
    return (
        <IonButton onClick={onClick} expand={expand} size={size} className={className} color={color}>
            {text} {icon && <IonIcon icon={icon} />}
        </IonButton>
    );
};

export default mobileButton;
