<template>
  <div id="users-settings" class="section column is-9 container">
    <div class="columns">
      <div class="column bg-white pd-15rem radius-box">
        <div class="columns">
          <div class="column is-6">
            <div class="setting-header">
              <h2 class="title is-4 sp-font weight-700">You</h2>
            </div>

            <div class="form-body">
              <div class="field">
                <label class="label sp-font">Name</label>
                <div class="control">
                  <input
                    v-model="userSettings.customName"
                    class="input"
                    type="text"
                    placeholder="Your Name"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label sp-font">Tagline</label>
                <div class="control">
                  <input
                    v-model="userSettings.tagline"
                    class="input"
                    type="text"
                    placeholder="Your tagline"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label sp-font">Website</label>
                <div class="control">
                  <input
                    v-model="userSettings.website"
                    class="input"
                    type="url"
                    placeholder="https://askmakers.co"
                  />
                </div>
              </div>

              <label class="label sp-font">Profile Picture</label>
              <img
                v-if="imageData"
                :src="imageData"
                width="60px"
                class="is-rounded"
              />
              <div class="file is-boxed">
                <label class="file-label">
                  <input
                    class="file-input"
                    type="file"
                    name="picture"
                    @change="onFileChange($event)"
                  />
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fas fa-upload"></i>
                    </span>
                    <span class="file-label">
                      Choose a file…
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div class="column is-6">
            <div class="setting-header">
              <h2 class="title is-4 sp-font weight-700">Social</h2>
            </div>
            <div class="form-body">
              <div class="field social-from">
                <div class="label sp-font">Twitter Handle</div>
                <div class="field-body">
                  <div class="field is-expanded">
                    <div class="field has-addons">
                      <p class="control">
                        <a class="button is-static">
                          <i class="fab fa-twitter"></i>
                        </a>
                      </p>
                      <p class="control is-expanded">
                        <input
                          v-model="userSettings.social.twitter"
                          class="input"
                          type="text"
                          placeholder="jack"
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="field social-from">
                <div class="label sp-font">Product Hunt Handle</div>
                <div class="field-body">
                  <div class="field is-expanded">
                    <div class="field has-addons">
                      <p class="control">
                        <a class="button is-static">
                          <i class="fab fa-product-hunt"></i>
                        </a>
                      </p>
                      <p class="control is-expanded">
                        <input
                          v-model="userSettings.social.productHunt"
                          class="input"
                          type="text"
                          placeholder="rrhoover"
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="field social-from">
                <div class="label sp-font">GitHub Handle</div>
                <div class="field-body">
                  <div class="field is-expanded">
                    <div class="field has-addons">
                      <p class="control">
                        <a class="button is-static">
                          <i class="fab fa-github"></i>
                        </a>
                      </p>
                      <p class="control is-expanded">
                        <input
                          v-model="userSettings.social.gitHub"
                          class="input"
                          type="text"
                          placeholder="defunkt"
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="field social-from">
                <div class="label sp-font">Patreon Handle</div>
                <div class="field-body">
                  <div class="field is-expanded">
                    <div class="field has-addons">
                      <p class="control">
                        <a class="button is-static">
                          <i class="fab fa-patreon"></i>
                        </a>
                      </p>
                      <p class="control is-expanded">
                        <input
                          v-model="userSettings.social.patreon"
                          class="input"
                          type="text"
                          placeholder="jackconte"
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="is-divider"></div>
          </div>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <button
                v-if="isLoading"
                class="button is-primary is-loading is-medium is-rounded"
                disabled
              >
                Save
              </button>
              <button
                v-else
                class="button is-medium is-primary is-rounded"
                @click.prevent="update"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import updateDoc from '~/plugins/updateDoc'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

export default {
  data() {
    return {
      imageData: '',
      isLoading: false,
      userSettings: {
        customName: '',
        tagline: '',
        website: '',
        picture: '',
        social: {
          twitter: '',
          productHunt: '',
          gitHub: '',
          patreon: ''
        }
      }
    }
  },
  validate({ store }) {
    if (store.getters.getLoginStatus === true) {
      return true
    }
    return false
  },
  created() {
    this.userSettings = this.$store.getters.getUserInfo
  },
  methods: {
    async update() {
      this.isLoading = true
      try {
        if (this.imageData !== '') {
          this.userSettings.picture = await this.upload(
            this.$store.getters.getUserInfo.uid
          )
        }
        const userRef = firestore
          .collection('publicUsers')
          .doc(this.$store.getters.getUserInfo.uid)
        await updateDoc(userRef, this.userSettings)
        this.$toast.open({
          message: 'Successfuly saved',
          type: 'is-success',
          duration: 4000
        })
      } catch (err) {
        this.$toast.open({
          message: 'Something went wrong...Please try again',
          type: 'is-danger',
          duration: 4000
        })
      } finally {
        this.isLoading = false
      }
    },
    onFileChange(e) {
      this.imageData = ''
      const files = e.target.files
      // blob形式に変換
      this.blob = new Blob(files, { type: 'image/png' })
      if (files.length > 0) {
        const file = files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imageData = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    async upload(id) {
      const updateDataConst = {}
      // 画像処理
      if (this.blob !== null) {
        const storageRef = firebase.storage().ref()
        const uploadRef = storageRef.child(`users/${id}.png`)
        await uploadRef.put(this.blob)
        const url = await uploadRef.getDownloadURL()
        updateDataConst.picture = url
        this.downloadURL = url
        return url
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$thinBorder: 1px solid #e8e0e0 !important;
.setting-header {
  border-bottom: $thinBorder;
  padding-bottom: 0.75rem;
}

.social-from {
  width: 300px;
}

.form-body {
  margin-top: 1rem;
}

#users-settings {
  .is-divider {
    margin: 0;
    border-top: 1px solid #dbdbdb;
  }
}
</style>
