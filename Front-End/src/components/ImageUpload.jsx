import React, {useState} from "react";

export const ImageUpload = (props) => {
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [imageLink, setImageLink] = useState(props.imageLink);

    const handleDragOver = (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (!overlayVisible)    setOverlayVisible(true);
    }
    const handleDragEnter = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setOverlayVisible(true);
    }
    const handleDragExit = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setOverlayVisible(false);
    }
    const handleDrop = (event) => {
        setOverlayVisible(false);
        event.stopPropagation();
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            let file = event.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
                props.setImage(file);
                setImageLink(URL.createObjectURL(file));
            }
        }
    }
    const getContent = () => {
        if (overlayVisible) {
            return (
                <div className="row align-items-center mx-auto text-center fs-6 border-2 rounded-pill"
                     style={{width: 150, height: 150, padding: 10, pointerEvents: "none"}}>
                    <div>
                        <i className="bi bi-cloud-upload" style={{fontSize: 30}}/>
                        <p>Release</p>
                    </div>
                </div>
            );
        }
        if (props.image === null) {
            return (
                <div className="row align-items-center mx-auto text-center fs-6 border-2 rounded-pill"
                     style={{width: 150, height: 150, padding: 10, pointerEvents: "none"}}>
                    <div>
                        <i className="bi bi-image" style={{fontSize: 30}}/>
                        <p>Drag & Drop</p>
                    </div>
                </div>
            );
        }
        return <img src={imageLink} className="mx-auto img-fluid rounded-circle border-2" style={{width: 150, height: 150, padding: 0, pointerEvents: "none"}}/>
    }
    const fileUpload = () => {
    }
    return (
        <div
            onDragOver={(event) => handleDragOver(event)}
            onDragEnter={(event) => handleDragEnter(event)}
            onDragLeave={(event) => handleDragExit(event)}
            onDrop={(event) => handleDrop(event)}
            className="m-auto"
        >
            <label className="row align-content-center">
                <input
                    name="image"
                    type="file"
                    accept=".png, .jpg"
                    onChange={fileUpload}
                    style={{visibility: "hidden", height: 0, width: 0, margin: 0, padding: 0}}
                />
                {getContent()}
            </label>
        </div>
    );
}