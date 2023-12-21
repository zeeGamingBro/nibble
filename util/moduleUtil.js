const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = {
    /**
    * @returns {Boolean}
    */
    isModuleEnabled: async(guildId, module) => {
        let enabled = false

        data = await prisma.guildModules.upsert({
            where: {
                guildId: guildId
            },
            update: {},
            create: {
                guildId: guildId
            }
        })
        
        return Boolean(data[module])
            
    }
}