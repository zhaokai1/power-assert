if (typeof window === 'undefined') {
    var expect = require('expect.js');
    var assert = require('../..');
}

describe('strict mode support', function () {

    var legacyModeAssert = assert;

    beforeEach(function () {
        assert = assert.strict;
    });
    afterEach(function () {
        assert = legacyModeAssert;
    });

    function expectPowerAssertMessage (body, expectedLines) {
        try {
            body();
            expect().fail("AssertionError should be thrown");
        } catch (e) {
            if (e.message === 'AssertionError should be thrown') {
                throw e;
            }
            expect(e.message.split('\n').slice(2, -1)).to.eql(expectedLines);
        }
    };

    it('`strict` mode assert should also be a function', function () {
        var foo = 'foo', bar = 8;
        expectPowerAssertMessage(function () {
            assert(foo === bar);
        }, [
            '  assert(foo === bar)',
            '         |   |   |   ',
            '         |   |   8   ',
            '         |   false   ',
            '         "foo"       ',
            '  ',
            '  [number] bar',
            '  => 8',
            '  [string] foo',
            '  => "foo"'
        ]);
    });

    it('equal becomes strictEqual', function () {
        var three = 3, threeInStr = '3';
        expectPowerAssertMessage(function () {
            assert.equal(three, threeInStr);
        },[
            '  assert.equal(three, threeInStr)',
            '               |      |          ',
            '               3      "3"        '
        ]);
    });

    it('deepEqual becomes deepStrictEqual', function () {
        var three = 3, threeInStr = '3';
        expectPowerAssertMessage(function () {
            assert.deepEqual({a: three}, {a: threeInStr});
        },[
            '  assert.deepEqual({ a: three }, { a: threeInStr })',
            '                   |    |        |    |            ',
            '                   |    |        |    "3"          ',
            '                   |    3        Object{a:"3"}     ',
            '                   Object{a:3}                     '
        ]);
    });
});
