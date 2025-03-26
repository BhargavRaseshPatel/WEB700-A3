class LegoData {
    sets;
    themes;

    constructor() {
        this.sets = [];
        this.themes = [];
    }

    initialize() {

        const setData = require("../data/setData");
        const themeData = require("../data/themeData");
        this.themes = [...themeData]

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

    getAllThemes() {
        return new Promise((resolve, reject) => {
            resolve(this.themes)
        })
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

    deleteSetByNum(setNum) {
        return new Promise((resolve, reject) => {
            let foundSetIndex = this.sets.findIndex(s => s.set_num == setNum)

            if(foundSetIndex != -1){
                this.sets.splice(foundSetIndex,1)
                resolve()
            } else if (foundSetIndex == -1){
                reject("unable to find out the theme")
            }
        })
    }

    getThemeById(id) {
        return new Promise((resolve, reject) => {
            let foundTheme = this.themes.find(t => t.id == id);

            if(foundTheme) {
                resolve(foundTheme)
            } else {
                reject("unable to find requested theme.")
            }
        })
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

