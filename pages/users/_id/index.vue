<template>
  <div id="users-id" class="section column is-9 container">
    <div class="columns">
      <div class="column bg-white pd-15rem radius-box">
        <div class="columns">
          <div class="column is-3">
            <figure class="image">
              <img src="/takato.jpeg" class="is-rounded" />
            </figure>
          </div>
          <div class="column">
            <p class="title is-3 weight-800 sp-font">Taishi Kato</p>
            <p>Hi, I am am Indie Maker based in Vancouver</p>
            <div>
              <a href="" class="icon twitter-icon" target="_blank">
                <i class="fab fa-twitter fa-lg"></i>
              </a>
              <a href="" class="icon ph-icon" target="_blank">
                <i class="fab fa-product-hunt fa-lg "></i>
              </a>
              <a href="" class="icon gh-icon" target="_blank">
                <i class="fab fa-github fa-lg"></i>
              </a>
              <a href="" class="icon patreon-icon" target="_blank">
                <i class="fab fa-patreon fa-lg"></i>
              </a>
            </div>
            <div id="website-btn">
              <a class="button is-rounded is-success weight-800">
                <span class="icon">
                  <i class="fas fa-external-link-alt"></i>
                </span>
                <span>
                  taishikato.com
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="profile-main-body" class="columns">
      <div class="column is-9">
        <h3 class="title is-5 sp-font">Ask A Question</h3>
        <div class="field">
          <div class="control">
            <textarea
              class="textarea"
              placeholder="What do you do when you have no power"
            ></textarea>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-primary is-rounded">Submit</button>
          </div>
        </div>
        <div class="is-divider"></div>
        <div id="answered-question-list">
          <h3 class="title is-5 sp-font">Answered Questions</h3>
          <ul>
            <li>
              <answered-question-card
                image="/question-ex.jpg"
                answer="質問ありがとうございます😊 基本的にはEast Hackersサロン( easthackers.com )入ってくれた方に限定で、案内や現地のことについてお話しさせて頂くくつもりです🙌"
              />
            </li>
            <li>
              <answered-question-card
                image="/question-ex.jpg"
                answer="質問ありがとうございます😊 基本的にはEast Hackersサロン( easthackers.com )入ってくれた方に限定で、案内や現地のことについてお話しさせて頂くくつもりです🙌"
              />
            </li>
          </ul>
        </div>
      </div>
      <div id="sidebar" class="column pd-15rem bg-white radius-box">
        <p class="title is-5 sp-font">Product</p>
      </div>
    </div>
  </div>
</template>

<script>
import AnsweredQuestionCard from '~/components/AnsweredQuestionCard'
export default {
  components: {
    AnsweredQuestionCard
  }
}
</script>

<style lang="scss" scoped>
.twitter-icon {
  color: #00aced;
  &:hover {
    color: #00aced;
  }
}

.ph-icon {
  color: #da552f;
  &:hover {
    color: #da552f;
  }
}

.gh-icon {
  color: #333;
  &:hover {
    color: #333;
  }
}

.patreon-icon {
  color: #e64413;
  &:hover {
    color: #e64413;
  }
}

#website-btn {
  margin-top: 1.5rem;
}

#profile-main-body {
  margin-top: 20px;
  #sidebar {
    height: 100%;
  }
  #answered-question-list {
    li {
      margin-top: 1.5rem;
    }
  }
}
</style>
