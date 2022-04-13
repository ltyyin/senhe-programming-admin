<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总用户
          </div>
          <count-to :start-val="0" :end-val="userTotal" :duration="2600"
            class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-course">
          <svg-icon icon-class="course" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总课程
          </div>
          <count-to :start-val="0" :end-val="courseTotal" :duration="3000"
            class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-article">
          <svg-icon icon-class="article" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总文章
          </div>
          <count-to :start-val="0" :end-val="articleTotal" :duration="3200"
            class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-question">
          <svg-icon icon-class="question" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总问答
          </div>
          <count-to :start-val="0" :end-val="questionTotal" :duration="3600"
            class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
	props: {
		userTotal: {
			type: Number,
			default: 0,
		},
		courseTotal: {
			type: Number,
			default: 0,
		},
		articleTotal: {
			type: Number,
			default: 0,
		},
		questionTotal: {
			type: Number,
			default: 0,
		},
	},
	components: {
		CountTo,
	},
}
</script>

<style lang="scss" scoped>
.panel-group {
	margin-top: 18px;

	.card-panel-col {
		margin-bottom: 32px;
	}

	.card-panel {
		height: 108px;
		cursor: pointer;
		font-size: 12px;
		position: relative;
		overflow: hidden;
		color: #666;
		background: #fff;
		box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
		border-color: rgba(0, 0, 0, 0.05);

		&:hover {
			.card-panel-icon-wrapper {
				color: #fff;
			}

			.icon-people {
				background: #40c9c6;
			}

			.icon-article {
				background: #36a3f7;
			}

			.icon-course {
				background: #f4516c;
			}

			.icon-question {
				background: #34bfa3;
			}
		}

		.icon-people {
			color: #40c9c6;
		}

		.icon-article {
			color: #36a3f7;
		}

		.icon-course {
			color: #f4516c;
		}

		.icon-question {
			color: #34bfa3;
		}

		.card-panel-icon-wrapper {
			float: left;
			margin: 14px 0 0 14px;
			padding: 16px;
			transition: all 0.38s ease-out;
			border-radius: 6px;
		}

		.card-panel-icon {
			float: left;
			font-size: 48px;
		}

		.card-panel-description {
			float: right;
			font-weight: bold;
			margin: 26px;
			margin-left: 0px;

			.card-panel-text {
				line-height: 18px;
				color: rgba(0, 0, 0, 0.45);
				font-size: 16px;
				margin-bottom: 12px;
			}

			.card-panel-num {
				font-size: 20px;
			}
		}
	}
}

@media (max-width: 550px) {
	.card-panel-description {
		display: none;
	}

	.card-panel-icon-wrapper {
		float: none !important;
		width: 100%;
		height: 100%;
		margin: 0 !important;

		.svg-icon {
			display: block;
			margin: 14px auto !important;
			float: none !important;
		}
	}
}
</style>
