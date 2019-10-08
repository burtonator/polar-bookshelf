import {Channels} from "./Channels";
import {assert} from 'chai';
import {DataURL} from './DataURLs';
import {DataURLs} from './DataURLs';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';

const dataURL: DataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAABWSURBVBiVrY67DcAgFAMPeA0F7L8Ya/AGQMhpUgQpUT7KSe58loMksWNmzDm5IsZIzplSCuGNuIw8av0p2l2htUatFYAxBr133B10IKUkYIm764zPVzfbakI0chQePQAAAABJRU5ErkJggg==";

describe('DataURLs', function() {

    it('Basic', function() {

        const decoded = DataURLs.decode(dataURL);
        assert.equal(decoded.type, 'image/png');
        assert.equal(Hashcodes.create(decoded), "1Jm47k81mS1cRF2ptSw2778AxZsKeguevzVwkwfybvKP8YqYPY");

    });

    it('parse broken', function() {
        DataURLs.decode("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAACqElEQVR4Xu3SsQ0AMAzDsOT/o1ugN1QbfYAHgTszZ0yBzwUWrM9F3b0CYIGQFAAryeoULAaSAmAlWZ2CxUBSAKwkq1OwGEgKgJVkdQoWA0kBsJKsTsFiICkAVpLVKVgMJAXASrI6BYuBpABYSVanYDGQFAAryeoULAaSAmAlWZ2CxUBSAKwkq1OwGEgKgJVkdQoWA0kBsJKsTsFiICkAVpLVKVgMJAXASrI6BYuBpABYSVanYDGQFAAryeoULAaSAmAlWZ2CxUBSAKwkq1OwGEgKgJVkdQoWA0kBsJKsTsFiICkAVpLVKVgMJAXASrI6BYuBpABYSVanYDGQFAAryeoULAaSAmAlWZ2CxUBSAKwkq1OwGEgKgJVkdQoWA0kBsJKsTsFiICkAVpLVKVgMJAXASrI6BYuBpABYSVanYDGQFAAryeoULAaSAmAlWZ2CxUBSAKwkq1OwGEgKgJVkdQoWA0kBsJKsTsFiICkAVpLVKVgMJAXASrI6BYuBpABYSVanYDGQFAAryeoULAaSAmAlWZ2CxUBSAKwkq1OwGEgKgJVkdQoWA0kBsJKsTsFiICkAVpLVKVgMJAXASrI6BYuBpABYSVanYDGQFAAryeoULAaSAmAlWZ2CxUBSAKwkq1OwGEgKgJVkdQoWA0kBsJKsTsFiICkAVpLVKVgMJAXASrI6BYuBpABYSVanYDGQFAAryeoULAaSAmAlWZ2CxUBSAKwkq1OwGEgKgJVkdQoWA0kBsJKsTsFiICkAVpLVKVgMJAXASrI6BYuBpABYSVanYDGQFAAryeoULAaSAmAlWZ2CxUBSAKwkq1OwGEgKgJVkdQoWA0kBsJKsTsFiICkAVpLVKVgMJAXASrI6BYuBpABYSVanYDGQFAAryeoULAaSAmAlWZ1eVZ6WAZNhay4AAAAASUVORK5CYII=");
    });

    it('parse data portion', function() {
        assert.equal(DataURLs.parseDataPortion(dataURL), "iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAABWSURBVBiVrY67DcAgFAMPeA0F7L8Ya/AGQMhpUgQpUT7KSe58loMksWNmzDm5IsZIzplSCuGNuIw8av0p2l2htUatFYAxBr133B10IKUkYIm764zPVzfbakI0chQePQAAAABJRU5ErkJggg==");

    });

});
