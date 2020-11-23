import MyEffect from './Incidents/Effect';
import MyCombo from './Incidents/Combo';
import MyHTMLClip from './Incidents/HTMLClip';
import MyClip from './Incidents/Clip';

export default {
  npm_name: "my-plugin-name", // !! make sure the name of your plugin is identical to the name of your package.json !!
  incidents: [
    {
      exportable: MyEffect,
      name: "MyEffect",
    //   attributesValidationRules: {
    //     // define your attributeValidationRules so MotorCortex can automatically validate them on instantiation 
    //     // also so your Incidents are directly embedable to DonkeyClip
    //     animatedAttrs: {
    //       type: "object",
    //       props: {
    //           attr: {
    //               type: 'string'
    //           }
    //         // validation rules as per [fastest-validator](https://www.npmjs.com/package/fastest-validator) library
    //       }
    //     }
    //   }
    },
    {
      exportable: MyCombo,
      name: "MyCombo",
      // define your attributeValidationRules so MotorCortex can automatically validate them on instantiation 
      // also so your Incidents are directly embedable to DonkeyClip
    //   attributesValidationRules: {}
    },
    {
      exportable: MyHTMLClip,
      name: "MyHTMLClip",
      // define your attributeValidationRules so MotorCortex can automatically validate them on instantiation 
      // also so your Incidents are directly embedable to DonkeyClip
    //   attributesValidationRules: {},
      originalDims: {
        width: "600px",
        height: "400px"
      }
    }
  ],
  Clip: {
      exportable: MyClip,
    //   attributesValidationRules: {}
  }
};