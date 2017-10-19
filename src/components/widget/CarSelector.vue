<template>
  <div class="carSelector-input"></div>
</template>

<script>
import api from '../../api'
export default {
  name: 'CarSelector',
  props: ['carValue', 'fullwidth'],
  data () {
    return {
      carData: this.carValue,
      s: null
    }
  },
  methods: {
    clearData () {
      this.s.reset()
      this.$emit('update:carValue', this.oCar)
    },
    destroy () {
      this.s.destroy()
    }
  },
  mounted () {
    var vm = this
    this.value = this.carValue
    this.s = new CarSelector({
      // api: 'http://184.api.kr.xingyuanauto.com/basedata/api?Method=Xy.Kr.BaseData.',
      elem: $(this.$el),
      callback: function () {
        vm.$emit('update:carValue', this.oCar)
      }
    })
    $(this.$el).next().on('click', function () {
      vm.$emit('update:carValue', this.oCar)
    })
  },
  watch: {
    carValue: function (val, oldVal) {
      this.s.setElemVal(val)
    }
  }
}
</script>

<style>
.carSelector-input {
  width: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #bfcbd9;
  box-sizing: border-box;
  color: #1f2d3d;
  font-size: inherit;
  height: 36px;
  line-height: 1;
  outline: 0;
  padding: 3px 10px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  line-height: 28px;
}
.carSelector ul>li.selected {
  color: #fff;
  background: #20a0ff!important;
}
.carSelector {
  z-index: 9999
}
</style>



// WEBPACK FOOTER //
// src/components/widget/CarSelector.vue?a3644f5e