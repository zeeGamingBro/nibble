const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = {
    isModuleEnabled: async (guildId, module) => {
        let data = await prisma.guildModules.upsert({
            where: {
                guildId: guildId
            },
            update: {},
            create: {
                guildId: guildId
            }
        })

        console.log(data)
        try {
            return data["module"]
        } catch (e) {
            console.error(e)
            return null
        }
        
    }
}