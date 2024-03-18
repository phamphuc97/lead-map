const assert = require('assert');
const { searchAddress, highlightBoundary } = require('../main');

describe('Search Address Function', function() {
    it('should return coordinates for a valid address', function() {
        // Mocking fetch call
        global.fetch = () => Promise.resolve({
            json: () => Promise.resolve([
                { lon: '10', lat: '20' } // Mock response data for successful address lookup
            ])
        });

        // Mock DOM element
        const inputElement = { value: 'Las Vegas' };

        // Mock function to set map view
        const setMapView = function(coordinates) {
            this.coordinates = coordinates;
        };

        // Call searchAddress function
        searchAddress.call({ map: { setView: setMapView } });

        // Assert that coordinates were set correctly
        assert.deepStrictEqual(this.coordinates, [10, 20]);
    });
});