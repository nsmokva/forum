<template>
  <div>
    <input type="file" ref="file" @change="loadImage($event)" accept="image/*">
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5">Use Google's location service?</v-card-title>
        <v-card-text>
          <cropper ref="cropper" class="upload-example-cropper" :src="image.src"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">Disagree</v-btn>
          <v-btn color="green darken-1" text @click="crop">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';
import axios from 'axios'


function getMimeType(file, fallback = null) {
	const byteArray = (new Uint8Array(file)).subarray(0, 4);
    let header = '';
    for (let i = 0; i < byteArray.length; i++) {
       header += byteArray[i].toString(16);
    }
	switch (header) {
        case "89504e47":
            return "image/png";
        case "47494638":
            return "image/gif";
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
            return "image/jpeg";
        default:
            return fallback;
    }
}

export default {
  props: ['loggedInUser'],
  components: {
    Cropper
  },
  data() {
    return {
      dialog: false,
      image: {
				src: null,
				type: null
			},
      imageName: ''
    };
  },
  computed: {
   
  },
  methods: {
    loadImage(event) {
      console.log('event is', event)
      this.imageName = event.target.files[0].name
      console.log('imagename issss.. ', this.imageName)
      this.dialog = true

      // Reference to the DOM input element
			const { files } = event.target;
			// Ensure that you have a file before attempting to read it
			if (files && files[0]) {
				// 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
				if (this.image.src) {
					URL.revokeObjectURL(this.image.src)
				}
				// 2. Create the blob link to the file to optimize performance:
				const blob = URL.createObjectURL(files[0]);
				
				// 3. The steps below are designated to determine a file mime type to use it during the 
				// getting of a cropped image from the canvas. You can replace it them by the following string, 
				// but the type will be derived from the extension and it can lead to an incorrect result:
				//
				// this.image = {
				//    src: blob;
				//    type: files[0].type
				// }
				
				// Create a new FileReader to read this image binary data
				const reader = new FileReader();
				// Define a callback function to run, when FileReader finishes its job
				reader.onload = (e) => {
					// Note: arrow function used here, so that "this.image" refers to the image of Vue component
					this.image = {
						// Set the image source (it will look like blob:http://example.com/2c5270a5-18b5-406e-a4fb-07427f5e7b94)
						src: blob,
						// Determine the image type to preserve it during the extracting the image from canvas:
						type: getMimeType(e.target.result, files[0].type),
					};
				};
				// Start the reader job - read file as a data url (base64 format)
				reader.readAsArrayBuffer(files[0]);
			}
    },
    crop() {
			const { canvas } = this.$refs.cropper.getResult();
			canvas.toBlob((blob) => {
        console.log('photo changed...................')
        this.photoChanged(blob)
				// Do something with blob: upload to a server, download and etc.
			}, this.image.type);
		},
    photoChanged(photoBlob){
      console.log('photo blob isss  ', photoBlob)
      var photoFile = new File([photoBlob], this.imageName);
      let formData = new FormData();
      formData.append('upload', photoFile);
      axios.post( '/backend/user/images/' + photoFile.name,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
        }
      })
      .then(()=>{
        console.log('photo saved')
        axios.post('/backend/user/userdata/avatar', {
          id: this.loggedInUser.id,
          avatar: photoFile.name
        })
        .then((response) => {
         console.log('avatar data updated, response is: ', response)
         // this.profileOwnerUser.photoName = p.name
         this.$emit('userUpdated', response)
         this.dialog = false
        })
        .catch(function (error) {
          console.log(error);
        });
      })
    }
  }
};
</script>



<style lang="scss" scoped>

</style>