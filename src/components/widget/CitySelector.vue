<template>
  <input type="text" />
</template>

<script>
import api from '../../api'
export default {
  name: 'CitySelector',
  props: ['cityValue', 'fullwidth'],
  data () {
    return {
      cityData: this.cityValue
    }
  },
  mounted () {
    var vm = this
    this.value = this.cityValue
    var s = new CitySelector({
      elem: $(this.$el),
      fullwidth: true,
      callback: function () {
        vm.$emit('update:cityValue', this.address)
      }
    })
    $(this.$el).next().on('click', function () {
      vm.$emit('update:cityValue', this.address)
    })
  }
}
</script>

<style>
.cascader-wrap input {
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
}
.cascader-wrap .close {
  margin-top: -13px;
}
.cascader ul li.selected {
  color: #fff;
  background: #20a0ff!important;
}
</style>



// WEBPACK FOOTER //
// src/components/widget/CitySelector.vue?3d58444d