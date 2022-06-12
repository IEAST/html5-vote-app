const images = {
    "options": "./images/options.png",
//    "ballast": "./images/random_big_ballast.png",
    "header": "./images/options_header.svg",
    "footer-btn-done": "./images/options_footer_btn_done.svg",
};

//const loaded_dataurls = {};
const loaded_images = {};

async function bg_load_by_name(name){
    let response = await fetch(images[name]);
    let blob = await response.blob(); //new Blob(chunks);
    
    let dataurl = await new Promise((resolve, reject)=>{
        let freader = new FileReader();
        freader.readAsDataURL(blob);
        freader.onload = ()=>resolve(freader.result);
    });

    loaded_images[name] = await bg_dataurl2image(dataurl);
}

async function bg_load_all(){
    for(let image_name in images) await bg_load_by_name(image_name);
}
bg_load_all();

async function bg_dataurl2image(dataurl){
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataurl;
    });
}

// --------------------------------------------------------------------------

async function assure_loaded(percentage_callback){
    return new Promise((resolve, reject)=>{
        function check_status(){
            const should_load = Object.keys(images).length;
            let actual_total = Object.keys(loaded_images).length;
            try{
                percentage_callback(parseInt(actual_total / should_load * 100));
            } catch(e){
            }
            if(actual_total != should_load){
                console.log("not all loaded");
                setTimeout(check_status, 1000);
            } else {
                resolve();
            }
        }
        check_status();
    });
}

async function get_image(image_name){
    await assure_loaded();
    /*return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = loaded_dataurls[image_name];
    });*/
    console.log(loaded_images);
    return loaded_images[image_name];
}

module.exports = {
    images,
    get_image,
    assure_loaded,
}