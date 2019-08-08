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
                <label class="label sp-font">First Name</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="Your first name"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label sp-font">Last Name</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label sp-font">Website</label>
                <div class="control">
                  <input
                    class="input"
                    type="url"
                    placeholder="https://askmakers.co"
                  />
                </div>
              </div>

              <label class="label sp-font">Profile Picture</label>
              <div class="file is-boxed">
                <label class="file-label">
                  <input class="file-input" type="file" name="resume" />
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
                        <input class="input" type="text" placeholder="jack" />
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
              <button class="button is-medium is-primary is-rounded">
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
export default {}
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
