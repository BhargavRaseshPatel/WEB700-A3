require('dotenv').config()

require('pg');
const Sequelize = require('sequelize')

class LegoData {
    Set;
    Theme;
    sequelize;

    constructor() {
        this.sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
            host: process.env.PGHOST,
            dialect: 'postgres',
            port: 5432,
            dialectOptions: {
                ssl: { rejectUnauthorized: false },
            },
        });

        this.Theme = this.sequelize.define('Theme', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true, // use "project_id" as a primary key
                autoIncrement: true,
            },
            name: Sequelize.STRING
        },
            {
                createdAt: false, // disable createdAt
                updatedAt: false, // disable updatedAt
            }
        )

        this.Set = this.sequelize.define('Set', {
            set_num: {
                type: Sequelize.STRING,
                primaryKey: true
            },
            name: Sequelize.STRING,
            year: Sequelize.INTEGER,
            num_parts: Sequelize.INTEGER,
            theme_id: Sequelize.INTEGER,
            img_url: Sequelize.STRING
        },
            {
                createdAt: false, // disable createdAt
                updatedAt: false, // disable updatedAt
            }
        )

        this.Set.belongsTo(this.Theme, { foreignKey: 'theme_id' })


    }

    initialize() {

        // const setData = require("../data/setData");
        // const themeData = require("../data/themeData");
        // this.themes = [...themeData]

        // return new Promise((resolve, reject) => {
        //     setData.forEach(setElement => {
        //         let setWithTheme = { ...setElement, theme: themeData.find(themeElement => themeElement.id == setElement.theme_id).name }
        //         this.sets.push(setWithTheme);
        //     });
        //     resolve();

        // });

        return new Promise((resolve, reject) => {
            this.sequelize.sync().then(() => {
                resolve()
            })
        })

    }

    getAllSets() {
        return new Promise((resolve, reject) => {
            this.Set.findAll({
                include: [this.Theme]
            }).then(data => {
                resolve(data)
            }).catch(error => {
                console.log("Error while fetching the data for theme, ", error)              
                reject(error)
            })
        });
    }

    getAllThemes() {
        return new Promise((resolve, reject) => {
            this.Theme.findAll().then(data => {
                resolve(data)
            }).catch( error => {
                console.log("Error while fetching the data for theme, ", error)
            })
        })
    }

    getSetByNum(setNum) {

        return new Promise((resolve, reject) => {
            // let foundSet = this.sets.find(s => s.set_num == setNum);

            // if (foundSet) {
            //     resolve(foundSet)
            // } else {
            //     reject("Unable to find requested set");
            // }

            this.Set.findOne({
                include: [this.Theme],
                where: { set_num: setNum }
            }).then(foundSet => {
                if (foundSet) {
                    resolve(foundSet);
                } else {
                    reject("Unable to find requested set");
                }
            }).catch(err => {
                reject("Error retrieving set: " + err);
            });

        });

    }

    deleteSetByNum(setNum) {
        return new Promise((resolve, reject) => {
            this.Set.destroy({
                where: { set_num: setNum }
            }).then(() => {
                resolve("Successfully Removed");
            }).catch(error => {
                reject("Error deleting set: " + error);
            });
        });
    }

    // getThemeById(id) {
    //     return new Promise((resolve, reject) => {
    //         let foundTheme = this.themes.find(t => t.id == id);

    //         if (foundTheme) {
    //             resolve(foundTheme)
    //         } else {
    //             reject("unable to find requested theme.")
    //         }
    //     })
    // }

    addSet(newSet) {
        return new Promise((resolve, reject) => {
            this.Set.findOne({
                where: {
                    set_num: newSet.set_num
                }
            }).then(existingSet => {
                if (existingSet) {
                    reject("Set already exists.");
                } else {
                    this.Set.create(newSet)
                        .then(() => {
                            resolve("Set added successfully");
                        })
                        .catch(err => {
                            reject("Error creating set: " + err);
                        });
                }
            }).catch(err => {
                reject("Error checking for existing set: " + err);
            });
        });
    }

    getSetsByTheme(theme) {

        return new Promise((resolve, reject) => {
            this.Set.findAll({
                include: [this.Theme], where: {
                    '$Theme.name$': {
                        [Sequelize.Op.iLike]: `%${theme}%`
                    }
                }
            }).then((data) => resolve(data)).catch(error => reject(error));

        });
    }
}

module.exports = LegoData;

