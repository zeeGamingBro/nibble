const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = {
    isModuleEnabled: async (guildId, module) => {
        prisma.guildModules.findUnique({
            where: {
                guildId: guildId
            }
        }).then((data) => {
            try {
                return data["module"]
            } catch (e) {
                console.error(e)
                return null
            }
        })
    }
}