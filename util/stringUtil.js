const Eris = require("eris")

/**
 * Takes an ID or mention string and returns a discord user, or null if doesn't exist
 * @param {Eris.Client} client 
 * @param {string} string 
 * @returns {(null|Eris.User)}
 */
function getUserFromID(client, string) {
    if (string instanceof Eris.User) return string;
    if (!string) return null;
    if (string.startsWith("<")) string = string.replace("<@!", "").replace("<@", "").replace(">", "")
    if (string.startsWith("[User ")) string = string.replace("[User ", "").replace("]", "") // Parse Eris stuff

    const user = client.users.get(string)
    if (user instanceof Eris.User) {
        return user
    } else {
        return null
    }
}

/**
 * Takes an ID or mention string and verifies they're a real user, or null if they aren't
 * @param {Eris.Client} client 
 * @param {string} string User ID or mention
 * @returns {(null|String)}
 */
function parseToUser(client, string) {
    // This seems inefficient, but it guarantees a person probably
    // It's not like IDU is too slow
    return getUserFromID(client, string).id || null
}

module.exports = {
    getUserFromID: getUserFromID,
    parseToUser: parseToUser
}