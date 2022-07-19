const StyleDictionaryPackage = require('style-dictionary');

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

StyleDictionaryPackage.registerFormat({
    name: 'css/variables',
    formatter: function (dictionary, config) {
      return `${this.selector} {
        ${dictionary.allProperties.map(prop => `  --${prop.name}: ${prop.value};`).join('\n')}
      }`
    }
  });  

StyleDictionaryPackage.registerTransform({
    name: 'sizes/px',
    type: 'value',
    matcher: function(prop) {
        // You can be more specific here if you only want 'em' units for font sizes    
        return ["fontSize", "spacing", "borderRadius", "borderWidth", "sizing"].includes(prop.attributes.type);
    },
    transformer: function(prop) {
        // You can also modify the value here if you want to convert pixels to ems
        return parseFloat(prop.original.value) + 'px';
    }
    });

function getStyleDictionaryConfig(theme) {
  return {
    "source": [
      `tokens/${theme}.json`,
    ],
    "platforms": {
      "web": {
        "transforms": ["attribute/cti", "name/cti/kebab", "sizes/px"],
        "buildPath": `output/`,
        "files": [{
            "destination": `${theme}.css`,
            "format": "css/variables",
            "selector": `.${theme}-theme`
          }]
      }
    },
      "android": {
      "transformGroup": "android",
      "buildPath": "output/",
      "files": [{
        "destination": "${theme}_colors.xml",
        "format": "android/colors"
      },{
        "destination": "${theme}_font_dimens.xml",
        "format": "android/fontDimens"
      },{
        "destination": "${theme}_dimens.xml",
        "format": "android/dimens"
      },{
        "destination": "${theme}_integers.xml",
        "format": "android/integers"
     },{
        "destination": "${theme}_strings.xml",
        "format": "android/strings"
      }]
    }
  };
}

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

['foundation', 'agree-culture', 'agree-fisheries', 'agree-livestock', 'agree-market'].map(function (theme) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${theme}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme));

    StyleDictionary.buildPlatform('web');

    console.log('\nEnd processing');
})

console.log('\n==============================================');
console.log('\nBuild completed!');
