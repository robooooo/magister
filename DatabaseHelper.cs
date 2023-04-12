using System;
using System.Linq;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using LiteDB;
// using LiteDB.Async;

namespace Magister
{

    

    public static class DB
    {
        public DataHelper<Db.GuildData> Guilds { get; private set; }
        public DataHelper<Db.ChannelData> Channels { get; private set; }

        // Convert ulong id used by dsharpplus to bson id used by litedb
        private static BsonValue ToId(ulong id) => new BsonValue((double)id);

        public class DataHelper<T> where T: new()
        {
            private LiteCollection<T> Collection;
            public DataHelper(LiteCollectionc<T> col) => Collection = col;
            public T Get(ulong id) => Collection.FindById(ToId(id)) ?? new T();
            public bool Set(ulong id, T value) => Collection.Upsert(ToId(id), value);

            public async Task<bool> Update(ulong id, Action<T> mapping) {
                T data = Get(id) ?? new T();
                mapping(data);
                return Set(id, data);
            }
        }

        public DatabaseHelper()
        {
            var Database = new LiteDatabaseAsync();
            Channels = new DataHelper<Db.ChannelData>(Database.GetCollection<Db.ChannelData>("channels"));
            Guilds = new DataHelper<Db.GuildData>(Database.GetCollection<Db.GuildData>("guilds"));
        }
    }
}