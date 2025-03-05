class LegoData {
    sets;

    constructor() {
        this.sets = [];
    }

    initialize() {

        const setData = require("../data/setData");
        const themeData = require("../data/themeData");

        return new Promise((resolve, reject) => {
            setData.forEach(setElement => {
                let setWithTheme = { ...setElement, theme: themeData.find(themeElement => themeElement.id == setElement.theme_id).name }
                this.sets.push(setWithTheme);
            });
            resolve();

        });

    }

    getAllSets() {
        return new Promise((resolve, reject) => {
            resolve(this.sets);
        });
    }

    getSetByNum(setNum) {

        return new Promise((resolve, reject) => {
            let foundSet = this.sets.find(s => s.set_num == setNum);

            if (foundSet) {
                resolve(foundSet)
            } else {
                reject("Unable to find requested set");
            }

        });

    }

    addSet(newSet) {
        return new Promise((resolve, reject) => {
            let foundSet = this.sets.find(s => s.set_num == newSet.set_num)

            if(foundSet){
                reject("Set already exists.")
            } else {
                this.sets.push(newSet)
                resolve()
            }
        })
    }

    getSetsByTheme(theme) {

        return new Promise((resolve, reject) => {
            let foundSets = this.sets.filter(s => s.theme.toUpperCase().includes(theme.toUpperCase()));

            if (foundSets) {
                resolve(foundSets)
            } else {
                reject("Unable to find requested sets");
            }

        });
    }
}

module.exports = LegoData;

