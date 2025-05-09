const { json } = require("sequelize");
const modelAntrian = require("./model");

const getAntrian = async (req,res) =>{
    try {
        const antrian = await modelAntrian.findAll();
        res.json({
            status: 200,
            message: "Data antrian",
            data: antrian
        })
    } catch (error) {
        res.json({
            status: 500,
            message: error.message,
        })
    }
};

const getAntrianById = async (req, res) => {
    try {
        const idCari = req.params.id;
        const antrian = await modelAntrian.findByPk(idCari);

        if (!antrian) {
            return res.status(404).json({
                status: 404,
                message: "Antrian tidak ditemukan",
            });
        }

        res.json({
            status: 200,
            message: "Data antrian berdasarkan ID",
            data: antrian,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

const getAntrianByNama = async (req, res) => {
    try {
        const { nama_antrian } = req.params;
        const antrian = await modelAntrian.findOne({
            where: { nama_antrian },
        });

        if (!antrian) {
            return res.status(404).json({
                status: 404,
                message: "Antrian tidak ditemukan",
            });
        }

        res.json({
            status: 200,
            message: "Data antrian berdasarkan nama",
            data: antrian,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

const addAntrian = async (req,res) => {
    try {
        const {nama_antrian} =  req.body;
        const namaAntrian = await modelAntrian.findOne({
            where: {nama_antrian},
        });

        if(namaAntrian) {
            return res.json({
                status: 400,
                message: "Nama antrian sudah ada",
            });
        }

        if(!nama_antrian || nama_antrian.trim() === "") {
            return res.json({
                status: 400,
                message: "Nama antrian tidak boleh ksosong",
            });
        }

        const tambahAntrian =  await modelAntrian.create({nama_antrian});
        res.json({
            status: 201,
            message: "Data antrian berhasil ditambahkan",
            data: tambahAntrian,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    };
};

const editAntrian = async (req,res) => {
    try {
        const idCari = req.params.id;
        const {nama_antrian} = req.body;
        const id = await modelAntrian.findByPk(idCari);
        const namaAntrian = await modelAntrian.findOne({
            where: {nama_antrian},
        });

        if(!id) {
            return res.json({
                status: 404,
                message: "Nama antrian tidak ditemukan",
            });
        } else if (namaAntrian) {
            return res.json({
                status: 400,
                message: "Nama  antrian sudah ada",
            });
        }

        await modelAntrian.update({nama_antrian},  {where: {id : idCari}});
        res.json({
            status: 200,
            message: "Nama antrian berhasil diedit",
        });
    } catch (error) {
        res.json({
            status: 500,
            message: error.message
        });
    }
};

const deleteAntrian = async (req,res) =>  {
    try {
        const idCari = req.params.id;
        const id = await modelAntrian.findByPk(idCari);

        if(!id) {
            return res.json({
                status: 404,
                message: "Nama antrian tidak ditemukan",
            });
        }

        await modelAntrian.destroy({
            where: {
                id: idCari,
            },
        });

        res.json({
            status: 200,
            message: "Nama antrian berhasil dihapus",
        });
    } catch (error) {
        res.json({
            status: 500,
            message: error.message,
        });
    }
};

module.exports =
{
getAntrian, 
addAntrian, 
editAntrian, 
deleteAntrian, 
getAntrianById, 
getAntrianByNama
}