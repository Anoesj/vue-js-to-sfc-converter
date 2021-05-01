/**
 * This is a comment
 */

import { someMixin } from '../helpers/someMixin.js';

const exampleComponent = {

  mixins: [
    someMixin,
  ],

  template:  `<section :data-id="id">
                <p>This is a paragraph</p>
              </section>`,

  data () {
    return {
      id: 'test',
    };
  },


};

export default exampleComponent;