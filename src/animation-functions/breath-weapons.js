import { JB2APATREONDB } from "./jb2a-patreon-database.js";
import { JB2AFREEDB } from "./jb2a-free-database.js";

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function breathWeapon(handler) {

    let audio = handler.allSounds.item;
    let audioEnabled = handler.itemSound;

    function moduleIncludes(test) {
        return !!game.modules.get(test);
    }

    let obj01 = moduleIncludes("jb2a_patreon") === true ? JB2APATREONDB : JB2AFREEDB;

    let obj02;
    let obj03;
    let color;
    let variant = handler.animExVariant;
    let filePath = "modules/jb2a_patreon/Library/BreathWeapon_Lightning_wip.webm"
    let multiplier;
    switch (variant) {
        case ('05'):
        case ('06'):
        case ('07'):
            multiplier = 1500;
            break;
        default:
            multiplier = 1000;
    }
    let divisor = (multiplier * (1/(handler.animExRadius)));
    
    let globalDelay = game.settings.get("autoanimations", "globaldelay");
    await wait(globalDelay);

    async function cast() {
        let loops = handler.animExLoop;
        //Finds the center of the placed circular template and plays an animation using FXMaster
        const templateID = canvas.templates.placeables[canvas.templates.placeables.length - 1].data._id;
        let template = await canvas.templates.documentCollection.get(templateID);
        console.log(template);
        // Scaled globally, change divisor for different size animation.
        let Scale = (canvas.scene.data.grid / 155);
        let token = handler.actorToken;
        //var handler.allTargets = Array.from(lastArg.targets);
        //let target = handler.allTargets[i];
        
        // Defines the spell template for FXMaster
        let spellAnim =
        {
            file: filePath,
            position: {
                x: template.data.x,
                y: template.data.y
            },
            anchor: {
                x: 0.05,
                y: 0.5
            },
            angle: -template.data.direction,
            scale: {
                x: Scale,
                y: Scale
            }
        };

        async function SpellAnimation(number) {

            let x = number;
            let interval = 1000;
            for (var i = 0; i < x; i++) {
                setTimeout(function () {
                    canvas.autoanimations.playVideo(spellAnim);
                    game.socket.emit('module.autoanimations', spellAnim);
                }, i * interval);
            }
        }
        // The number in parenthesis sets the number of times it loops
        SpellAnimation(1)
    }
    cast();
    if (audioEnabled) {
        await wait(audio.delay);
        AudioHelper.play({ src: audio.file, volume: audio.volume, autoplay: true, loop: false }, true);
    }
}

export default breathWeapon;