var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var Schema = mongoose.Schema;
var AutoIncrement = require('mongoose-sequence')(mongoose);
var ObjectId = Schema.Types.ObjectId;
var trangthai_duanSchema = new Schema({
  name: String,
  class: String,
  thutu: Number
});
mongoose.model('trangthai_duan', trangthai_duanSchema);
var project_rolesSchema = new Schema({
  key: String,
  defval: {
    type: Boolean,
    default: false
  }
});
mongoose.model('project_roles', project_rolesSchema);
var assigned_projectSchema = new Schema({
  project: {
    type: ObjectId,
    ref: 'projects'
  },
  user: {
    type: ObjectId,
    ref: "users"
  },
  roles: [{
    k: String,
    v: Boolean,
  }],
  date_created: {
    type: Date,
    default: new Date()
  }
});
mongoose.model('assigned_project', assigned_projectSchema);
var projectsSchema = new Schema({
  project_id: Number,
  project_code: String,
  project_title: String,
  description: String,
  diadiem: String,
  chudautu: {
    type: Schema.Types.ObjectId,
    ref: 'companies'
  },
  loaicongtrinh: {
    type: Schema.Types.ObjectId,
    ref: 'loaicongtrinh'
  },
  capcongtrinh: Number,
  nhomduan: String,
  nguonvondautu: String,
  tongmucdautu: Number,
  goithauthuchien: [{
    type: ObjectId,
    ref: 'loaicongviec'
  }],
  nhansu: [{
    type: ObjectId,
    ref: 'nhansuduan'
  }],
  start_date: Date,
  due_date: Date,
  notes: String,
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  trangthai: {
    date: {
      type: Date,
      default: Date.now
    },
    trangthai: {
      type: ObjectId,
      ref: 'trangthai_duan',
      default: mongoose.Types.ObjectId("5926ce7d007e1392bd8899d6")
    }
  },
  lichsu_trangthai: [{
    date: {
      type: Date,
      default: Date.now
    },
    trangthai: {
      type: ObjectId,
      ref: 'trangthai_duan',
      default: mongoose.Types.ObjectId("5926ce7d007e1392bd8899d6")
    }
  }],
  milestones: [{
    type: Schema.Types.ObjectId,
    ref: 'milestones'
  }],
  progress: Number,
  activities: [{
    type: Schema.Types.ObjectId,
    ref: 'activities'
  }],
  vitri: String,
  theodoi: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    tag_label: String,
    flags: String,
    last_seen_activities: Date
  }],
  project_folder: String,
  proj_deleted: Boolean,
  archived: Boolean,
  date_created: {
    type: Date,
    default: Date.now
  }
});
projectsSchema.post('save', function () {
  this.populate({
    path: 'goithauthuchien',
    populate: {
      path: 'phongth'
    }
  }, function (err, p) {
    // console.log(p);
    // console.log(this.trangthai);
    if (p.progress >= 100) {
      if (p.trangthai.trangthai == '5926ce7d007e1392bd8899d6') {
        p.trangthai = {
          date: new Date(),
          trangthai: '5926cea17ad6dc92db28d9cc'
        };
        p.lichsu_trangthai.push({
          date: new Date(),
          trangthai: '5926cea17ad6dc92db28d9cc'
        });
        p.save();
      }
    };
  });
});
projectsSchema.statics.check_theodoi = function (id, user, fn) {
  var conditions = {
    _id: id,
    'theodoi.user': user
  };
  this.find(conditions).exec(function (err, p) {
    if (p.length > 0) {
      fn(true);
    } else {
      fn(false);
    }
  });
};
projectsSchema.statics.details = function (p_id, socket, fn) {
  var data = {
    p_id: p_id,
    ac: "check_permission"
  }
  var vm = this;
  this.list(data, socket, function (ls) {
    if (ls) {
      vm.aggregate([{
            $match: {
              project_id: Number(p_id)
            }
          },
          {
            $lookup: {
              from: "companies",
              localField: "chudautu",
              foreignField: "_id",
              as: "chudautu"
            }
          },
          {
            $lookup: {
              from: "loaicongtrinhs",
              localField: "loaicongtrinh",
              foreignField: "_id",
              as: "loaicongtrinh"
            }
          },
          {
            $project: {
              _id: 1,
              project_id: "$project_id",
              nhomduan: "$nhomduan",
              capcongtrinh: "$capcongtrinh",
              created_by: "$create_by",
              loaicongtrinh: {
                $arrayElemAt: ["$loaicongtrinh", 0]
              },
              chudautu: {
                $arrayElemAt: ["$chudautu", 0]
              },
              project_title: "$project_title",
              project_code: "$project_code",
              diadiem: 1,
              hopdong: {
                _id: 1,
                sohopdong: 1,
                tengoithau: 1,
                nhansu: {
                  _id: 1,
                  chucdanh: 1,
                  nhansu: {
                    _id: 1,
                    fullname: 1
                  }
                }
              },
              vitri: 1,
              date_created: 1
            }
          }
        ])
        .exec(function (err, p) {
          fn(p[0]);
        });
    } else {
      fn(ls)
    }
  })

};
projectsSchema.statics.list = function (data, socket, fn) {
  var first_m = {
    proj_deleted: {
      $ne: true
    }
  };
  if (data.ac == "check_permission") {
    // first_m._id = mongoose.Types.ObjectId(data.p_id);
    first_m = {
      project_id: Number(data.p_id)
    }

  }
  var m = {};
  if (!socket.request.user.roles.xem_tat_ca_du_an) {
    m = {
      $or: [{
          theohopdong: mongoose.Types.ObjectId(socket.request.user.company._id)
        },
        {
          theogoithau: mongoose.Types.ObjectId(socket.request.user.company._id)
        },
        {
          theoloaicongviec: mongoose.Types.ObjectId(socket.request.user.company._id)
        },
        {
          super_theohopdong: mongoose.Types.ObjectId(socket.request.user._id)
        },
        {
          super_theogoithau: mongoose.Types.ObjectId(socket.request.user._id)
        },
        {
          super_theohopdong: mongoose.Types.ObjectId(socket.request.user._id)
        },
        {
          primary_theohopdong: mongoose.Types.ObjectId(socket.request.user._id)
        },
        {
          primary_theogoithau: mongoose.Types.ObjectId(socket.request.user._id)
        },
        {
          primary_theohopdong: mongoose.Types.ObjectId(socket.request.user._id)
        },
        {
          created_by: mongoose.Types.ObjectId(socket.request.user._id)
        },
      ]
    };
  };
  this.aggregate([{
        $match: first_m,
      },
      {
        $lookup: {
          from: 'milestones',
          localField: '_id',
          foreignField: 'project',
          as: 'milestones'
        }
      },
      {
        $lookup: {
          from: "loaicongviecs",
          localField: "goithauthuchien",
          foreignField: "_id",
          as: "goithauthuchien"
        }
      },
      {
        $unwind: {
          path: '$milestones',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$goithauthuchien',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          project_id: 1,
          project_title: 1,
          date_created: 1,
          trangthai: 1,
          progress: 1,
          created_by: 1,
          theoloaicongviec: "$milestones.loaicongviec",
          theogoithau: "$goithauthuchien.phongth",
          theohopdong: "$milestones.hopdong",
          milestones: 1
        }
      },
      {
        $lookup: {
          from: 'hopdongs',
          localField: 'theohopdong',
          foreignField: '_id',
          as: 'theohopdong'
        }
      },
      {
        $lookup: {
          from: 'loaicongviecs',
          localField: 'theoloaicongviec',
          foreignField: '_id',
          as: 'theoloaicongviec'
        }
      },
      {
        $unwind: {
          path: '$theohopdong',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'hopdongs',
          localField: 'milestones.hopdong',
          foreignField: '_id',
          as: 'milestones.hopdong'
        }
      },
      {
        $project: {
          _id: 1,
          project_id: 1,
          project_title: 1,
          date_created: 1,
          trangthai: 1,
          progress: 1,
          created_by: 1,
          theoloaicongviec: "$theoloaicongviec.phongth",
          theogoithau: 1,
          theohopdong: "$theohopdong.giatri",
          milestones: 1
        }
      },
      {
        $lookup: {
          from: 'giatrihopdongs',
          localField: 'theohopdong',
          foreignField: '_id',
          as: 'theohopdong'
        }
      },
      {
        $project: {
          _id: 1,
          project_id: 1,
          project_title: 1,
          date_created: 1,
          trangthai: 1,
          progress: 1,
          theoloaicongviec: 1,
          theogoithau: 1,
          created_by: 1,
          theohopdong: "$theohopdong.congtac",
          milestones: 1
        }
      },
      {
        $unwind: {
          path: '$theohopdong',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$theoloaicongviec',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'congtachds',
          localField: 'theohopdong',
          foreignField: '_id',
          as: 'theohopdong'
        }
      },
      {
        $project: {
          _id: 1,
          project_id: 1,
          project_title: 1,
          date_created: 1,
          trangthai: 1,
          progress: 1,
          theoloaicongviec: 1,
          theogoithau: 1,
          created_by: 1,
          theohopdong: "$theohopdong.loaicongviec",
          milestones: 1
        }
      },
      {
        $lookup: {
          from: 'loaicongviecs',
          localField: 'theohopdong',
          foreignField: '_id',
          as: 'theohopdong'
        }
      },
      {
        $unwind: {
          path: '$theohopdong',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          project_id: 1,
          project_title: 1,
          date_created: 1,
          trangthai: 1,
          progress: 1,
          theoloaicongviec: 1,
          theogoithau: 1,
          created_by: 1,
          theohopdong: "$theohopdong.phongth",
          milestones: 1
        }
      },
      {
        $lookup: {
          from: "companies",
          localField: "theoloaicongviec",
          foreignField: "_id",
          as: "theoloaicongviec_com"
        }
      },
      {
        $lookup: {
          from: "companies",
          localField: "theogoithau",
          foreignField: "_id",
          as: "theogoithau_com"
        }
      },
      {
        $lookup: {
          from: "companies",
          localField: "theohopdong",
          foreignField: "_id",
          as: "theohopdong_com"
        }
      },
      {
        $unwind: {
          path: '$theogoithau_com',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$theoloaicongviec_com',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$theohopdong_com',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          project_id: 1,
          project_title: 1,
          date_created: 1,
          trangthai: 1,
          progress: 1,
          theoloaicongviec: 1,
          theogoithau: 1,
          theohopdong: 1,
          created_by: 1,
          super_theohopdong: "$theohopdong_com.super_user",
          super_theoloaicongviec: "$theoloaicongviec_com.super_user",
          super_theogoithau: "$theogoithau_com.super_user",
          primary_theohopdong: "$theohopdong_com.primary_user",
          primary_theoloaicongviec: "$theoloaicongviec_com.primary_user",
          primary_theogoithau: "$theogoithau_com.primary_user",
          milestones: 1
        }
      },
      {
        $unwind: {
          path: '$milestones.hopdong',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: m
      },
      {
        $group: {
          _id: "$_id",
          project: {
            $first: "$$ROOT"
          }
        }
      },
      {
        $replaceRoot: {
          newRoot: "$project"
        }
      },
      {
        $sort: {
          date_created: -1
        }
      }
    ])
    .exec(function (err, ps) {
      if (data.ac == "check_permission") {
        if (ps.length > 0) {
          fn(true)
        } else {
          fn(false)
        }
      } else {
        fn(ps);
      }

    })
}
projectsSchema.plugin(AutoIncrement, {
  inc_field: 'project_id'
});
mongoose.model('projects', projectsSchema);

var nhansuduanSchema = new Schema({
  project: {
    type: ObjectId,
    ref: 'projects'
  },
  nhansu: {
    type: ObjectId,
    ref: 'users'
  },
  chucdanh: {
    type: ObjectId,
    ref: 'chucdanh_duan'
  },
  loaicongviec: {
    type: ObjectId,
    ref: 'loaicongviec'
  }
});
mongoose.model('nhansuduan', nhansuduanSchema);

var chucdanh_duanSchema = new Schema({
  chucdanh: String,
  loaicongviec: {
    type: ObjectId,
    ref: 'loaicongviec'
  }
});
mongoose.model('chucdanh_duan', chucdanh_duanSchema);

var hdSchema = new Schema({

});
mongoose.model('hd', hdSchema);