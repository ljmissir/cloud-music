webpackJsonp([7],{L4ZJ:function(t,e){},Rhjk:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("Dd8w"),s=n.n(i),a=n("Sgn/"),r=n("T452"),o=n("NYxO"),c=n("ge/m"),u=n("Bkxr"),g={data:function(){return{songs:[]}},computed:s()({},Object(o.c)(["singer"]),{title:function(){return this.singer.name},bgImage:function(){return this.singer.avatar}}),created:function(){this._getSingerDetail()},methods:{_getSingerDetail:function(){var t=this;if(this.singer.id){Object(a.a)(this.singer.id).then(function(e){e.code===r.a&&(t.songs=t._mapSongList(e.data.list))})}else this.$router.push("/singer")},_mapSongList:function(t){var e=[];return t.forEach(function(t){var n=t.musicData;n.songid&&n.albumid&&e.push(Object(c.a)(n))}),e}},components:{MusicList:u.a}},d={render:function(){var t=this.$createElement,e=this._self._c||t;return e("transition",{attrs:{name:"slide"}},[e("music-list",{attrs:{title:this.title,songs:this.songs,"bg-image":this.bgImage}})],1)},staticRenderFns:[]},h=n("VU/8")(g,d,!1,function(t){n("L4ZJ")},"data-v-62d03395",null);e.default=h.exports}});
//# sourceMappingURL=7.bf1203f827b9b9c4c399.js.map