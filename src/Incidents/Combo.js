import MotorCortex from '@kissmybutton/motorcortex';

/**
 * For details of the Combo concept and usage please refer to
 * documentation.
 * 
 * As soon as you are familiar with MotorCortex.Combo it's extremely
 * easy to implement your own Incidents by extending it. The only
 * method you need to write is the get incidents where you can 
 * define your fix incidents of your Combo. Feel free to use
 * any dynamic value (@stagger, @expression, @attribute) as well as
 * to use this.attrs in order to access your Combo's attrs and produce
 * dynamic results.
 */
export default class MyCombo extends MotorCortex.Combo{
    get incidents(){
        return [];
    }
}