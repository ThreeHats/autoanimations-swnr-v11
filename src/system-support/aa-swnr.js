import { debug }            from "../constants/constants.js";
import { trafficCop }       from "../router/traffic-cop.js";
import AAHandler            from "../system-handlers/workflow-data.js";
import { getRequiredData }  from "./getRequiredData.js";

export function systemHooks() {
    Hooks.on("createChatMessage", async (msg) => {checkChatMessage(msg) });
}

async function checkChatMessage(msg) {
    console.log("Checking Chat Message");
    
    // Skip messages from other users
    if (msg.user.id !== game.user.id) { return };

    let findData = await enhancedItemFinder(msg);
    
    if (!findData.itemId) { 
        debug("Unable to locate Item ID from Chat Message HTML", msg);
        return;
    }
    
    let item = msg.item ?? msg.itemSource ?? findData.item;
    let compiledData = await getRequiredData({
        itemId: findData.itemId,
        item: item,
        actorId: findData.actorId,
        tokenId: findData.tokenId,
        workflow: msg,
    });
    
    console.log("Compiled data:", compiledData);
    
    const handler = await AAHandler.make(compiledData);
    if (!handler?.item || !handler?.sourceToken) { 
        debug("No Item or Source Token", handler); 
        return;
    }
    
    trafficCop(handler);
}

async function enhancedItemFinder(msg) {
    // Extract item name from the h3 tag in the message content
    const $content = $(msg.content);
    const itemName = $content.find('h3').text().trim();
    console.log(`Found item name in message: "${itemName}"`);
    
    // Initialize return values
    let itemId = null;
    let actorId = null;
    let tokenId = null;
    let item = null;
    let foundActor = null;
    
    // Try from speaker object first
    if (msg.speaker?.actor) {
        actorId = msg.speaker.actor;
        tokenId = msg.speaker.token;
        foundActor = game.actors.get(actorId);
        
        if (foundActor) {
            console.log(`Found actor from speaker: ${foundActor.name} (${foundActor.type})`);
            const matchingItem = foundActor.items.find(i => i.name === itemName);
            if (matchingItem) {
                console.log(`Found matching item on actor: ${matchingItem.id}`);
                itemId = matchingItem.id;
                item = matchingItem;
            }
        }
    }
    
    // If item not found, search all relevant actors
    if (!itemId) {
        console.log("Item not found on speaker actor, searching all actors");
        
        // Check active tokens in the scene first
        const tokens = canvas.tokens.placeables.filter(t => t.actor);
        for (const token of tokens) {
            const actor = token.actor;
            const matchingItem = actor.items.find(i => i.name === itemName);
            if (matchingItem) {
                console.log(`Found matching item on token actor: ${actor.name} (${actor.id})`);
                itemId = matchingItem.id;
                item = matchingItem;
                actorId = actor.id;
                tokenId = token.id;
                foundActor = actor;
                break;
            }
        }
        
        // If still not found, check all game actors (including vehicles, ships, etc.)
        if (!itemId) {
            const vehicleTypes = ["character", "vehicle", "ship", "mech", "drone"];
            for (const actor of game.actors.contents) {
                if (!vehicleTypes.includes(actor.type)) continue;
                
                const matchingItem = actor.items.find(i => i.name === itemName);
                if (matchingItem) {
                    console.log(`Found matching item on game actor: ${actor.name} (${actor.type})`);
                    itemId = matchingItem.id;
                    item = matchingItem;
                    actorId = actor.id;
                    
                    // Try to find a token for this actor
                    const token = canvas.tokens.placeables.find(t => t.actor?.id === actor.id);
                    if (token) tokenId = token.id;
                    
                    foundActor = actor;
                    break;
                }
            }
        }
    }
    
    // If still not found, fall back to flags
    if (!itemId) {
        console.log("Trying to find item from message flags");
        const systemId = game.system.id;
        let flags = msg.flags;
        itemId = flags.itemId ??
                flags.ItemId ??
                flags[systemId]?.itemId ??
                flags[systemId]?.ItemId ??
                msg.rolls?.[0]?.options?.itemId;
    }
    
    console.log(`Final data - itemId: ${itemId}, actorId: ${actorId}, tokenId: ${tokenId}, foundActor: ${foundActor?.name}`);
    return { 
        itemId, 
        tokenId, 
        actorId,
        item,
        actor: foundActor
    };
}
