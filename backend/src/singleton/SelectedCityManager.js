// SelectedCityManager.js

class SelectedCityManager {
    constructor() {
        if (!SelectedCityManager.instance) {
            this.city = null;
            SelectedCityManager.instance = this;
        }

        return SelectedCityManager.instance;
    }

    setCity(city) {
        this.city = city?.toLowerCase();
    }

    getCity() {
        return this.city;
    }

    clearCity() {
        this.city = null;
    }
}

const instance = new SelectedCityManager();


export default instance;
